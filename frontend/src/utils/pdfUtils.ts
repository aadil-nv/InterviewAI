/**
 * Extracts text content from a PDF file using native PDF.js with inline worker
 * @param file - The PDF file to extract text from
 * @returns Promise<string> - The extracted text content
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up worker inline to avoid CORS issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';

    // Iterate through all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text from each item in the page
      const pageText = textContent.items
        .map((item: any) => {
          // Check if item has 'str' property (text content)
          return item.str || '';
        })
        .join(' ');
      
      // Add page text to full text with a newline separator
      fullText += pageText + '\n';
    }

    // Return trimmed text (remove leading/trailing whitespace)
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
  }
};