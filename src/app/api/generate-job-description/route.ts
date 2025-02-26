import { NextRequest, NextResponse } from 'next/server';
import { generateJobDescription } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { title, skills } = await req.json();

    if (!title || !skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Title and skills array are required' },
        { status: 400 }
      );
    }

    const jobDescription = await generateJobDescription(title, skills);

    return NextResponse.json({ jobDescription });
  } catch (error) {
    console.error('Error generating job description:', error);
    return NextResponse.json(
      { error: 'Failed to generate job description' },
      { status: 500 }
    );
  }
}
