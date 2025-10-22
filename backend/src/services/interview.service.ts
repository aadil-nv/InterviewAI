import { injectable, inject } from "inversify";
import { IInterviewRepository } from "../repositories/interfaces/interview.repository.interface";
import { CreateInterviewDTO } from "../dtos/create-interview.dto";
import { Interview } from "../interfaces/interview.interface";
import { IInterviewService } from "./interfaces/interview.service.interface";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";
import { IInterviewDocument } from "../models/interview.model";

@injectable()
export class InterviewService implements IInterviewService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @inject("IInterviewRepository") private interviewRepo: IInterviewRepository
  ) {
    this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  }

  // ---------- Generate Questions ----------
 async generateQuestions(resumeText: string, jdText: string): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
You are an expert technical interviewer. Based on the candidate's resume and the job description provided below, generate exactly 5 relevant technical interview questions.

**Resume:**
${resumeText}

**Job Description:**
${jdText}

**Instructions:**
1. Generate exactly 5 questions
2. Questions should be relevant to the candidate's experience and the job requirements
3. Mix behavioral and technical questions
4. Format: Output ONLY the questions, one per line, numbered as 1. 2. 3. 4. 5.
5. DO NOT include any introductory text, headers, or explanations
6. DO NOT include phrases like "Here are the questions" or "Interview questions:"
7. Make questions specific and actionable
8. Focus on skills, experience, and technologies mentioned in both documents

Example format:
1. [First question here]
2. [Second question here]
3. [Third question here]
4. [Fourth question here]
5. [Fifth question here]

Generate the 5 interview questions now (questions only, no additional text):
      `.trim();

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("✅ Gemini raw response:", text);

      // Improved parsing to filter out introductory lines
      const questions = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .filter((line) => {
          // Filter out common introductory phrases
          const lowerLine = line.toLowerCase();
          return !lowerLine.startsWith("here are") &&
                 !lowerLine.startsWith("interview questions") &&
                 !lowerLine.includes("relevant technical interview") &&
                 !lowerLine.includes("based on the") &&
                 !lowerLine.startsWith("**") &&
                 line.length > 15; // Must be substantial
        })
        .map((line) => {
          // Remove numbering patterns like "1.", "1)", "Question 1:", etc.
          return line
            .replace(/^\d+[\.\)]\s*/, "")
            .replace(/^Question\s*\d+[:\.\)]\s*/i, "")
            .replace(/^\*\*\d+[\.\)]\s*/, "")
            .replace(/^\*\*/g, "")
            .replace(/\*\*$/g, "")
            .replace(/^[-•]\s*/, "") // Remove bullet points
            .trim();
        })
        .filter((q) => {
          // Final validation: must be a proper question
          return q.length > 20 && 
                 (q.endsWith("?") || q.includes("describe") || q.includes("explain"));
        });

      console.log("✅ Parsed questions:", questions);

      // If we got at least 5 questions, return first 5
      if (questions.length >= 5) {
        return questions.slice(0, 5);
      }

      // If we got some questions but less than 5, pad with generic ones
      if (questions.length > 0 && questions.length < 5) {
        const genericQuestions = [
          "Tell me about a challenging project you worked on recently.",
          "How do you stay updated with the latest technologies in your field?",
          "Describe a time when you had to debug a complex issue.",
          "What is your approach to code reviews and collaboration?",
          "Where do you see yourself growing in this role?",
        ];
        
        const needed = 5 - questions.length;
        return [...questions, ...genericQuestions.slice(0, needed)];
      }

      // Fallback if parsing fails
      console.warn("⚠️ Failed to parse questions, using fallback");
      return this.getFallbackQuestions();

    } catch (error) {
      console.error("❌ Error generating questions with Gemini:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return this.getFallbackQuestions();
    }
  }

  private getFallbackQuestions(): string[] {
    return [
      "Describe your most recent project and the technologies you used.",
      "What challenges did you face in your last role and how did you overcome them?",
      "How do you approach solving complex technical problems?",
      "What technologies or frameworks are you most confident with and why?",
      "Why do you think you are a good fit for this role based on your experience?",
    ];
  }

  async createInterview(
    data: CreateInterviewDTO,
    resumeText: string,
    jdText: string,
    userId: string
  ): Promise<Interview> {
    console.log("📝 Generating questions...");
    const questions = await this.generateQuestions(resumeText, jdText);
    console.log("✅ Generated questions:", questions);

    const interview = await this.interviewRepo.create(data, questions, userId);

    return {
      id: interview.id,
      resumeUrl: interview.resumeUrl,
      jdUrl: interview.jdUrl,
      questions: interview.questions,
      answers: interview.answers,
      score: interview.score,
      createdAt: interview.createdAt,
    };
  }

  // ---------- Get All ----------
  async getAllInterviewsByUser(id: string): Promise<Interview[]> {
    return await this.interviewRepo.findAllByUserId(id);
  }

  // ---------- Get By ID ----------
  async getInterviewById(id: string): Promise<Interview | null> {
    return await this.interviewRepo.findById(id);
  }

  // ---------- Submit Answers ----------
  async submitAnswers(
  id: string,
  answers: string[],
  userId: string
): Promise<Interview | null> {
  console.log("calling submit answer service ==>", id, answers);

  const interview = await this.interviewRepo.findById(id);
  if (!interview) return null;

  const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let totalScore = 0;
  let feedbacks: string[] = [];

  for (let i = 0; i < interview.questions.length; i++) {
    const q = interview.questions[i];
    const ans = answers[i] || "";

    // Improved prompt with structured output format
    const prompt = `
You are an expert technical interviewer. Evaluate the candidate's answer to the following question.

Question: ${q}

Candidate's Answer: ${ans}

Context: This is for a position matching the job description at ${interview.jdUrl}. 
The candidate's resume is available at ${interview.resumeUrl}.

Please provide your evaluation in the following EXACT format:

SCORE: [number from 1-10]
FEEDBACK: [Your detailed feedback in 100 words maximum]

Scoring criteria:
- 1-3: Poor (incorrect, irrelevant, or no substantial answer)
- 4-5: Below Average (partially correct but missing key points)
- 6-7: Good (correct with minor gaps)
- 8-9: Very Good (comprehensive and well-explained)
- 10: Excellent (exceptional answer with depth and clarity)

Provide constructive feedback focusing on:
- Accuracy and relevance
- Depth of understanding
- Areas for improvement
`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Extract score with improved regex
      const scoreMatch = text.match(/SCORE:\s*(\d{1,2})/i);
      let score = 5; // default score
      
      if (scoreMatch) {
        score = Math.max(1, Math.min(parseInt(scoreMatch[1]), 10));
      } else {
        // Fallback: try to find any number between 1-10
        const fallbackMatch = text.match(/\b([1-9]|10)\b/);
        if (fallbackMatch) {
          score = parseInt(fallbackMatch[1]);
        }
      }

      totalScore += score;

      // Extract feedback with improved parsing
      const feedbackMatch = text.match(/FEEDBACK:\s*(.+)/is);
      const feedback = feedbackMatch 
        ? feedbackMatch[1].trim().substring(0, 500) // limit length
        : text.substring(0, 500); // fallback to full text

      feedbacks.push(`**Question ${i + 1}:** ${q}\n**Score:** ${score}/10\n**Feedback:** ${feedback}`);

    } catch (error) {
      console.error(`Error evaluating question ${i + 1}:`, error);
      // Add default values in case of error
      totalScore += 5;
      feedbacks.push(`**Question ${i + 1}:** ${q}\n**Score:** 5/10\n**Feedback:** Unable to evaluate this answer due to a processing error.`);
    }
  }

  const avgScore = Math.round(totalScore / interview.questions.length);
  const feedback = feedbacks.join("\n\n---\n\n");

  const updated = await this.interviewRepo.updateAnswersAndScore(
    id,
    answers,
    avgScore,
    feedback
  );

  return updated;
}

  // ---------- Delete Interview ----------
  async deleteInterview(id: string): Promise<Interview | null> {
    return await this.interviewRepo.deleteById(id);
  }
}
