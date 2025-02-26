import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resume') as File;

    if (!resumeFile) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      );
    }

    // Read the file content
    const resumeText = await resumeFile.text();

    // Parse the resume using OpenAI
    const parsedData = await parseResume(resumeText);

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}
