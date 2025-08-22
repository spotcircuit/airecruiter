// Custom PDF parser that avoids the test file issue
import { Buffer } from 'buffer';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Try pdf-parse-new first (more reliable)
    const pdfParseNew = require('pdf-parse-new');
    const data = await pdfParseNew(buffer, {
      max: 0, // No page limit
      version: 'v2.0.550'
    });
    console.log('Successfully extracted text with pdf-parse-new');
    return data.text;
  } catch (err1) {
    console.log('pdf-parse-new failed:', err1.message);
    
    // Try a simpler approach - extract text patterns from PDF
    try {
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = textDecoder.decode(buffer);
      
      // Extract text between stream markers
      const streamMatches = rawText.match(/stream\s*([\s\S]*?)\s*endstream/g);
      let extractedText = '';
      
      if (streamMatches) {
        for (const match of streamMatches) {
          // Extract text from each stream
          const streamContent = match.replace(/stream|endstream/g, '');
          // Look for text between parentheses (common in PDFs)
          const textMatches = streamContent.match(/\((.*?)\)/g);
          if (textMatches) {
            extractedText += textMatches.map(m => m.slice(1, -1)).join(' ') + ' ';
          }
        }
      }
      
      // Also try to extract text between BT/ET markers
      const btMatches = rawText.match(/BT\s*([\s\S]*?)\s*ET/g);
      if (btMatches) {
        for (const match of btMatches) {
          const content = match.replace(/BT|ET/g, '');
          const textMatches = content.match(/\((.*?)\)/g);
          if (textMatches) {
            extractedText += textMatches.map(m => m.slice(1, -1)).join(' ') + ' ';
          }
        }
      }
      
      // Clean up the extracted text
      extractedText = extractedText
        .replace(/\\(\d{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)))
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\')
        .replace(/\\(.)/g, '$1')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (extractedText.length > 100) {
        console.log('Extracted text using custom PDF parser');
        return extractedText;
      }
      
      // Final fallback - extract any readable ASCII text
      const readableText = rawText
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (readableText.length > 100) {
        console.log('Extracted readable text from PDF buffer');
        return readableText;
      }
      
      throw new Error('Could not extract meaningful text from PDF');
    } catch (fallbackError) {
      console.error('PDF text extraction failed:', fallbackError);
      throw new Error('Failed to extract text from PDF file');
    }
  }
}