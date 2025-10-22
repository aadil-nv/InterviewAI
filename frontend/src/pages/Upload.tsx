import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import type { AppDispatch, RootState } from '../app/store';
import { addInterview, setLoading } from '../features/interviewSlice';
import type { Interview } from '../interfaces/types';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../api/cloudinaryApi';
import { createInterviewAPI } from '../api/interviewApi';
import { extractTextFromPDF } from '../utils/pdfUtils';
import Navigation from '../components/Navigation';

const UploadPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [resumeProgress, setResumeProgress] = useState(0);
  const [jdProgress, setJdProgress] = useState(0);
  const [resumeUrl, setResumeUrl] = useState('');
  const [jdUrl, setJdUrl] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [isDragging, setIsDragging] = useState<'resume' | 'jd' | null>(null);
  const [error, setError] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingJd, setUploadingJd] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.interview);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const User=useSelector((state:RootState)=>state.auth.user);

  const handleFileUpload = async (
    file: File,
    type: 'resume' | 'jd',
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    setUrl: React.Dispatch<React.SetStateAction<string>>,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setError('');
      setUploading(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 300);

      const extractedText = await extractTextFromPDF(file);
      if (type === 'resume') {
        setResumeText(extractedText);
      } else {
        setJdText(extractedText);
      }

      const folder = type === 'resume' ? 'resumes' : 'job_descriptions';
      const url = await uploadToCloudinary(file, folder);

      clearInterval(progressInterval);
      setProgress(100);
      setUrl(url);
      setUploading(false);
    } catch (err) {
      setError(`Failed to upload ${type}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProgress(0);
      setUploading(false);
      if (type === 'resume') {
        setResumeFile(null);
        setResumeText('');
      } else {
        setJdFile(null);
        setJdText('');
      }
    }
  };

  const handleFileDrop = (e: React.DragEvent, type: 'resume' | 'jd') => {
    e.preventDefault();
    setIsDragging(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 2 * 1024 * 1024) {
      if (type === 'resume') {
        setResumeFile(file);
        handleFileUpload(file, 'resume', setResumeProgress, setResumeUrl, setUploadingResume);
      } else {
        setJdFile(file);
        handleFileUpload(file, 'jd', setJdProgress, setJdUrl, setUploadingJd);
      }
    } else {
      setError('Please upload a valid PDF file (max 2MB)');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf' && file.size <= 2 * 1024 * 1024) {
      if (type === 'resume') {
        setResumeFile(file);
        handleFileUpload(file, 'resume', setResumeProgress, setResumeUrl, setUploadingResume);
      } else {
        setJdFile(file);
        handleFileUpload(file, 'jd', setJdProgress, setJdUrl, setUploadingJd);
      }
    } else {
      setError('Please upload a valid PDF file (max 2MB)');
    }
  };

  const generateQuestions = async () => {
    if (!resumeUrl || !jdUrl || !resumeText || !jdText) return;
    dispatch(setLoading(true));
    try {
      const response = await createInterviewAPI({ 
        resumeUrl, 
        jdUrl, 
        resumeText, 
        jdText ,
        userId:User?._id
      });

      console.log("create interview responce",response.interview);
      

      const newInterview: Interview = {
        id: response.interview.id,
        resumeUrl: response.interview.resumeUrl,
        jdUrl: response.interview.jdUrl,
        questions: response.interview.questions,
        answers: response.interview.answers,
        score: response.interview.score,
        createdAt: response.interview.createdAt,
      };

      dispatch(addInterview(newInterview));
      dispatch(setLoading(false));
      navigate('/interview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
      dispatch(setLoading(false));
    }
  };

  const isUploadComplete = resumeProgress === 100 && jdProgress === 100 && 
                          resumeUrl && jdUrl && resumeText && jdText;
  const isUploading = uploadingResume || uploadingJd;

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 sm:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
            Upload Your Documents
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-red-800">{error}</p>
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Resume (PDF, Max 2MB)
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging('resume'); }}
                onDragLeave={() => setIsDragging(null)}
                onDrop={(e) => handleFileDrop(e, 'resume')}
                onClick={() => !uploadingResume && resumeInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition ${
                  isDragging === 'resume' ? 'border-blue-500 bg-blue-50' : uploadingResume ? 'border-gray-300 cursor-not-allowed' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input 
                  ref={resumeInputRef} 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => handleFileSelect(e, 'resume')} 
                  className="hidden" 
                  disabled={uploadingResume} 
                />
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                <p className="text-sm sm:text-base text-gray-600 mb-2 px-2">
                  {resumeFile ? resumeFile.name : 'Drag & drop your resume or click to browse'}
                </p>
                {resumeFile && resumeProgress < 100 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${resumeProgress}%` }} 
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Uploading... {resumeProgress}%
                    </p>
                  </div>
                )}
                {resumeProgress === 100 && resumeUrl && (
                  <div className="mt-4 flex items-center justify-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm sm:text-base">Uploaded successfully</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Job Description (PDF, Max 2MB)
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging('jd'); }}
                onDragLeave={() => setIsDragging(null)}
                onDrop={(e) => handleFileDrop(e, 'jd')}
                onClick={() => !uploadingJd && jdInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition ${
                  isDragging === 'jd' ? 'border-purple-500 bg-purple-50' : uploadingJd ? 'border-gray-300 cursor-not-allowed' : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <input 
                  ref={jdInputRef} 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => handleFileSelect(e, 'jd')} 
                  className="hidden" 
                  disabled={uploadingJd} 
                />
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                <p className="text-sm sm:text-base text-gray-600 mb-2 px-2">
                  {jdFile ? jdFile.name : 'Drag & drop job description or click to browse'}
                </p>
                {jdFile && jdProgress < 100 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${jdProgress}%` }} 
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Uploading... {jdProgress}%
                    </p>
                  </div>
                )}
                {jdProgress === 100 && jdUrl && (
                  <div className="mt-4 flex items-center justify-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm sm:text-base">Uploaded successfully</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={generateQuestions}
              disabled={!isUploadComplete || isUploading || loading}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Questions...</span>
                </>
              ) : (
                <span>Generate Interview Questions</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;