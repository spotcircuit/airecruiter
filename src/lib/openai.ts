import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateJobDescription(title: string, skills: string[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter who writes compelling job descriptions.',
        },
        {
          role: 'user',
          content: `Generate a professional job description for a ${title} position. Required skills: ${skills.join(', ')}.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Failed to generate job description';
  } catch (error) {
    console.error('Error generating job description:', error);
    throw new Error('Failed to generate job description');
  }
}

export async function parseResume(resumeText: string): Promise<{
  skills: string[];
  experience: { company: string; title: string; years: number }[];
  education: { institution: string; degree: string; field: string }[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at parsing resumes and extracting structured information.',
        },
        {
          role: 'user',
          content: `Parse the following resume and extract skills, experience, and education information. Return the data in JSON format.\n\n${resumeText}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
}

export async function rankCandidates(
  jobDescription: string,
  candidates: Array<{ id: string; resumeText: string }>
): Promise<Array<{ id: string; score: number }>> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter who can match candidates to job descriptions.',
        },
        {
          role: 'user',
          content: `Rank the following candidates for this job description: ${jobDescription}\n\nCandidates:\n${candidates
            .map((c) => `ID: ${c.id}\nResume: ${c.resumeText}\n`)
            .join('\n')}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content).rankings || [];
  } catch (error) {
    console.error('Error ranking candidates:', error);
    throw new Error('Failed to rank candidates');
  }
}

export default openai;
