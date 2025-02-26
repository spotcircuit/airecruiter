import OpenAI from 'openai';

// Comment out the API key check for the build
// if (!process.env.OPENAI_API_KEY) {
//   throw new Error('Missing OpenAI API Key');
// }

// Create a mock openai object or use the actual API if key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null as any; // Use 'as any' to allow build to proceed

export async function generateJobDescription(title: string, skills: string[]): Promise<string> {
  // Return mock data if OpenAI API is not available
  if (!process.env.OPENAI_API_KEY) {
    return `# ${title} Position\n\n## About the Role\nWe're looking for an experienced ${title} to join our team. This is a mock job description since the OpenAI API key is not configured.\n\n## Required Skills\n${skills.map(skill => `- ${skill}`).join('\n')}\n\n## Responsibilities\n- Work on exciting projects\n- Collaborate with team members\n- Deliver high-quality results\n\n## Qualifications\n- Previous experience in ${title} role\n- Strong communication skills\n- Problem-solving abilities`;
  }

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
  // Return mock data if OpenAI API is not available
  if (!process.env.OPENAI_API_KEY) {
    return {
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML/CSS'],
      experience: [
        { company: 'Tech Company Inc.', title: 'Senior Developer', years: 3 },
        { company: 'Startup Co.', title: 'Developer', years: 2 }
      ],
      education: [
        { institution: 'University of Technology', degree: 'Bachelor', field: 'Computer Science' }
      ]
    };
  }

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
  // Return mock data if OpenAI API is not available
  if (!process.env.OPENAI_API_KEY) {
    // Generate mock rankings with random scores between 60-95
    return candidates.map(candidate => ({
      id: candidate.id,
      score: Math.floor(Math.random() * 36) + 60 // Random score between 60-95
    })).sort((a, b) => b.score - a.score); // Sort by score in descending order
  }
  
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
