import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { parseResume as parseResumeAI, generateEmbedding } from '@/lib/openai';
// NOTE: Avoid importing heavy parsers at module scope to prevent build-time side effects.
// We'll dynamically import them only when needed in the request handler.

// Disable static optimization for this route and ensure Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Save resume file to local uploads directory
async function saveResumeFile(file: File, candidateId?: number): Promise<string> {
  const uploadDir = process.cwd() + '/public/uploads/resumes';
  const fs = require('fs').promises;
  const path = require('path');
  
  // Create directory if it doesn't exist
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}_${candidateId || 'temp'}_${sanitizedName}`;
  const filePath = path.join(uploadDir, fileName);
  
  // Save file
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return `/uploads/resumes/${fileName}`;
  } catch (err) {
    console.error('Error saving file:', err);
    return '';
  }
}

// Extract text from different file types
async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());
  
  try {
    if (fileName.endsWith('.pdf')) {
      // Extract text from PDF
      const pdf = (await import('pdf-parse')).default;
      const data = await pdf(buffer);
      return data.text;
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      // Extract text from Word document
      const mammoth = (await import('mammoth')).default;
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
      // Plain text or markdown
      return await file.text();
    } else {
      // Try to read as text for other formats
      return await file.text();
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text from ${fileName}. Supported formats: PDF, DOCX, DOC, MD, TXT`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Extract text based on file type
    let text = await extractTextFromFile(file);
    
    // Limit text length to avoid context window issues
    // GPT-5 nano has ~128k token limit, roughly 4 chars per token
    // Use 20k chars (about 5k tokens) for safety with the prompt
    const maxLength = 20000;
    if (text.length > maxLength) {
      console.log(`Resume text truncated from ${text.length} to ${maxLength} characters`);
      text = text.substring(0, maxLength);
    }
    
    // Parse with GPT-5 nano - no fallback
    const aiParsed = await parseResumeAI(text);
    
    if (!aiParsed || !aiParsed.email) {
      throw new Error('AI failed to extract required information from resume');
    }
    
    // Generate embedding for semantic search (limit to 8k chars for embedding model)
    const embeddingText = text.substring(0, 8000);
    const embedding = await generateEmbedding(embeddingText);
    
    const parsedData = {
      firstName: aiParsed.name?.split(' ')[0] || 'Unknown',
      lastName: aiParsed.name?.split(' ').slice(1).join(' ') || 'Candidate',
      email: aiParsed.email,
      phone: aiParsed.phone,
      location: aiParsed.location || null,
      currentTitle: aiParsed.title || aiParsed.experience?.[0]?.title,
      currentCompany: aiParsed.current_company || aiParsed.experience?.[0]?.company,
      yearsExperience: aiParsed.years_experience || 0,
      skills: aiParsed.skills || [],
      experience: aiParsed.experience || [],
      education: aiParsed.education || [],
      linkedinUrl: aiParsed.linkedin_url || null,
      githubUrl: aiParsed.github_url || null,
      summary: aiParsed.summary || `${aiParsed.title || 'Professional'} with ${aiParsed.years_experience || 0} years of experience`,
      rawText: text.substring(0, 5000),
      embedding
    };
    
    console.log('Successfully parsed resume with GPT-5 nano');
    
    // Check if resume_embedding column exists
    const columnCheck = await query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'candidates' AND column_name = 'resume_embedding'`,
      []
    );
    
    const hasEmbeddingColumn = columnCheck.rows.length > 0;
    
    // Store in database
    const existingCandidate = await query(
      'SELECT id FROM candidates WHERE email = $1',
      [parsedData.email]
    );
    
    if (existingCandidate.rows.length === 0) {
      // Insert new candidate
      let insertQuery: string;
      let insertParams: any[];
      
      if (hasEmbeddingColumn) {
        insertQuery = `INSERT INTO candidates (
          first_name, last_name, email, phone, location,
          current_title, current_company, years_experience,
          skills, linkedin_url, github_url, notes,
          resume_text, resume_embedding
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id`;
        insertParams = [
          parsedData.firstName,
          parsedData.lastName,
          parsedData.email,
          parsedData.phone,
          parsedData.location,
          parsedData.currentTitle,
          parsedData.currentCompany,
          parsedData.yearsExperience,
          parsedData.skills,
          parsedData.linkedinUrl,
          parsedData.githubUrl,
          parsedData.summary,
          text.substring(0, 10000),
          `[${embedding.slice(0, 100).join(',')}]`
        ];
      } else {
        insertQuery = `INSERT INTO candidates (
          first_name, last_name, email, phone, location,
          current_title, current_company, years_experience,
          skills, linkedin_url, github_url, notes,
          resume_text
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id`;
        insertParams = [
          parsedData.firstName,
          parsedData.lastName,
          parsedData.email,
          parsedData.phone,
          parsedData.location,
          parsedData.currentTitle,
          parsedData.currentCompany,
          parsedData.yearsExperience,
          parsedData.skills,
          parsedData.linkedinUrl,
          parsedData.githubUrl,
          parsedData.summary,
          text.substring(0, 10000)
        ];
      }
      
      const result = await query(insertQuery, insertParams);
      
      parsedData['candidateId'] = result.rows[0].id;
      
      // Save the resume file
      const filePath = await saveResumeFile(file, result.rows[0].id);
      if (filePath) {
        // Update candidate with resume file path
        await query(
          'UPDATE candidates SET resume_url = $1 WHERE id = $2',
          [filePath, result.rows[0].id]
        );
        parsedData['resumeUrl'] = filePath;
      }
    } else {
      parsedData['candidateId'] = existingCandidate.rows[0].id;
      parsedData['message'] = 'Candidate already exists in database';
      
      // Save new version of resume if candidate exists
      const filePath = await saveResumeFile(file, existingCandidate.rows[0].id);
      if (filePath) {
        if (hasEmbeddingColumn) {
          await query(
            'UPDATE candidates SET resume_url = $1, resume_text = $2, resume_embedding = $3 WHERE id = $4',
            [filePath, text.substring(0, 10000), `[${embedding.slice(0, 100).join(',')}]`, existingCandidate.rows[0].id]
          );
        } else {
          await query(
            'UPDATE candidates SET resume_url = $1, resume_text = $2 WHERE id = $3',
            [filePath, text.substring(0, 10000), existingCandidate.rows[0].id]
          );
        }
        parsedData['resumeUrl'] = filePath;
      }
    }
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse resume' },
      { status: 500 }
    );
  }
}