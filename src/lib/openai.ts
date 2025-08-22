import OpenAI from 'openai';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION_ID 
    }) 
  : null as any;

// OpenAI model configuration
const MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Parse resume and extract structured data
export async function parseResume(resumeText: string): Promise<{
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  years_experience?: number;
  skills: string[];
  experience: { company: string; title: string; years: number }[];
  education: { institution: string; degree: string; field: string }[];
  current_company?: string;
  certifications?: string[];
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  summary?: string;
}> {
  if (!openai) {
    return extractBasicInfo(resumeText);
  }

  try {
    // Use standard OpenAI chat completions API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a resume parser. Extract structured information from resumes and return it as JSON. Be thorough and accurate.'
        },
        {
          role: 'user',
          content: `Extract the following information from this resume and return it as a JSON object:
- name (string)
- email (string)
- phone (string)
- title (current job title, string)
- years_experience (total years, number)
- skills (array of strings)
- experience (array of objects with: company, title, years)
- education (array of objects with: institution, degree, field)
- current_company (string)
- certifications (array of strings)
- location (string)
- linkedin_url (string)
- github_url (string)
- summary (brief 2-3 sentence summary)

Resume text:
${resumeText}

Return ONLY valid JSON, no additional text.`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const result = response.choices[0]?.message?.content || '{}';
    try {
      // Clean the result in case there's extra text
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : result;
      const parsed = JSON.parse(jsonStr);
      
      // Ensure required fields have default values
      return {
        name: parsed.name || 'Unknown',
        email: parsed.email || '',
        phone: parsed.phone || '',
        title: parsed.title || '',
        years_experience: parsed.years_experience || 0,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        current_company: parsed.current_company || '',
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        location: parsed.location || '',
        linkedin_url: parsed.linkedin_url || '',
        github_url: parsed.github_url || '',
        summary: parsed.summary || ''
      };
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError, 'Response:', result);
      return extractBasicInfo(resumeText);
    }
  } catch (error) {
    console.error('Resume parsing error:', error);
    return extractBasicInfo(resumeText);
  }
}

// Generate embeddings for semantic search
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!openai) {
    return Array(1536).fill(0).map(() => Math.random() - 0.5);
  }

  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return embedding.data[0].embedding;
  } catch (error) {
    console.error('Embedding generation error:', error);
    return Array(1536).fill(0).map(() => Math.random() - 0.5);
  }
}

// Generate personalized email
export async function generateEmail(
  candidateName: string,
  candidateRole: string,
  candidateCompany: string,
  jobTitle: string,
  companyName: string,
  personalNote?: string
): Promise<string> {
  if (!openai) {
    return generateFallbackEmail(candidateName, jobTitle, companyName);
  }

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional recruiter writing personalized outreach emails.'
        },
        {
          role: 'user',
          content: `Write a personalized recruiting email to ${candidateName}, a ${candidateRole} at ${candidateCompany}, about a ${jobTitle} position at ${companyName}. ${personalNote ? `Additional context: ${personalNote}` : ''} Keep it professional, concise (3-4 sentences), and mention something specific about their background.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0]?.message?.content || generateFallbackEmail(candidateName, jobTitle, companyName);
  } catch (error) {
    console.error('Email generation error:', error);
    return generateFallbackEmail(candidateName, jobTitle, companyName);
  }
}

// Classify email reply intent
export async function classifyReplyIntent(emailContent: string): Promise<'interested' | 'not_interested' | 'question' | 'out_of_office' | 'unsubscribe'> {
  if (!openai) {
    return classifyWithPatterns(emailContent);
  }

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'Classify email reply intent. Return ONLY one word: interested, not_interested, question, out_of_office, or unsubscribe.'
        },
        {
          role: 'user',
          content: `Email: "${emailContent}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });

    const intent = response.choices[0]?.message?.content?.trim().toLowerCase();
    if (['interested', 'not_interested', 'question', 'out_of_office', 'unsubscribe'].includes(intent as string)) {
      return intent as any;
    }
    
    return classifyWithPatterns(emailContent);
  } catch (error) {
    console.error('Intent classification error:', error);
    return classifyWithPatterns(emailContent);
  }
}

// Generate job description
export async function generateJobDescription(
  title: string,
  skills: string[],
  company?: string,
  requirements?: string[],
  benefits?: string[]
): Promise<string> {
  const companyName = company || 'our company';
  const reqs = requirements || skills;
  const bens = benefits || ['Competitive salary', 'Health insurance', 'Remote work options'];

  if (!openai) {
    return generateFallbackJobDescription(title, companyName, reqs, bens);
  }

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional HR writer creating compelling job descriptions.'
        },
        {
          role: 'user',
          content: `Generate a compelling job description for a ${title} position at ${companyName}. Key requirements: ${reqs.join(', ')}. Benefits: ${bens.join(', ')}. Format with clear sections: Role Overview, Key Responsibilities, Requirements, Benefits.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || generateFallbackJobDescription(title, companyName, reqs, bens);
  } catch (error) {
    console.error('Job description generation error:', error);
    return generateFallbackJobDescription(title, companyName, reqs, bens);
  }
}

// Match candidate to job with scoring
export async function matchCandidateToJob(
  candidateSkills: string[],
  candidateExperience: number,
  jobRequirements: string[],
  requiredExperience: number
): Promise<{ score: number; explanation: string }> {
  if (!openai) {
    return {
      score: calculateFallbackScore(candidateSkills, candidateExperience, jobRequirements, requiredExperience),
      explanation: 'Score calculated based on skills and experience match'
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a recruiter matching candidates to jobs. Provide scores and explanations in JSON format.'
        },
        {
          role: 'user',
          content: `Match this candidate to a job and provide a score from 1-10 with explanation.
Candidate: ${candidateExperience} years experience, skills: ${candidateSkills.join(', ')}
Job requires: ${requiredExperience}+ years, skills: ${jobRequirements.join(', ')}
Return JSON with format: {"score": number, "explanation": "brief explanation"}`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    try {
      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return {
        score: result.score || calculateFallbackScore(candidateSkills, candidateExperience, jobRequirements, requiredExperience),
        explanation: result.explanation || 'Score calculated based on skills and experience match'
      };
    } catch {
      return {
        score: calculateFallbackScore(candidateSkills, candidateExperience, jobRequirements, requiredExperience),
        explanation: 'Score calculated based on skills and experience match'
      };
    }
  } catch (error) {
    console.error('Matching error:', error);
    return {
      score: calculateFallbackScore(candidateSkills, candidateExperience, jobRequirements, requiredExperience),
      explanation: 'Score calculated based on skills and experience match'
    };
  }
}

// Generate Boolean search query
export async function generateBooleanQuery(jobDescription: string, platform: 'linkedin' | 'google' | 'indeed' = 'linkedin'): Promise<string> {
  if (!openai) {
    return generateFallbackBooleanQuery(jobDescription);
  }

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating Boolean search queries for recruiting. Return only the query, no explanation.'
        },
        {
          role: 'user',
          content: `Convert this job description into a Boolean search query for ${platform}. Use AND, OR, NOT operators and parentheses. Focus on key skills and titles. Job: ${jobDescription}`
        }
      ],
      temperature: 0.3,
      max_tokens: 150
    });

    return response.choices[0]?.message?.content || generateFallbackBooleanQuery(jobDescription);
  } catch (error) {
    console.error('Boolean query generation error:', error);
    return generateFallbackBooleanQuery(jobDescription);
  }
}

// Rank candidates (legacy support)
export async function rankCandidates(
  jobDescription: string,
  candidates: Array<{ id: string; resumeText: string }>
): Promise<Array<{ id: string; score: number }>> {
  if (!openai) {
    return candidates.map(candidate => ({
      id: candidate.id,
      score: Math.floor(Math.random() * 36) + 60
    })).sort((a, b) => b.score - a.score);
  }

  try {
    const scores = await Promise.all(
      candidates.map(async (candidate) => {
        const candidateInfo = extractBasicInfo(candidate.resumeText);
        const jobReqs = extractKeywords(jobDescription);
        const match = await matchCandidateToJob(
          candidateInfo.skills,
          candidateInfo.years_experience || 0,
          jobReqs,
          5 // default required experience
        );
        return { id: candidate.id, score: match.score * 10 };
      })
    );
    
    return scores.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error ranking candidates:', error);
    return candidates.map(candidate => ({
      id: candidate.id,
      score: Math.floor(Math.random() * 36) + 60
    })).sort((a, b) => b.score - a.score);
  }
}

// Fallback functions
function extractBasicInfo(text: string): any {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
  
  // Extract skills by looking for common programming languages and tools
  const skillPatterns = /\b(JavaScript|TypeScript|React|Angular|Vue|Node\.?js|Python|Java|C\+\+|C#|AWS|Azure|Docker|Kubernetes|SQL|MongoDB|Git|REST|GraphQL|HTML|CSS|SASS|Redux|Express|Django|Spring|\.NET|PHP|Ruby|Rails|Go|Rust|Swift|Kotlin|Flutter|React Native)\b/gi;
  const skills = Array.from(new Set(text.match(skillPatterns) || []));
  
  // Extract years of experience
  const yearsMatch = text.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i);
  const years_experience = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  
  return {
    name: nameMatch?.[1] || 'Unknown',
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0] || '',
    title: 'Professional',
    years_experience,
    skills,
    experience: [],
    education: [],
    current_company: ''
  };
}

function generateFallbackEmail(name: string, jobTitle: string, company: string): string {
  return `Hi ${name},

I came across your profile and was impressed by your background. We have an exciting ${jobTitle} opportunity at ${company} that aligns well with your experience.

Would you be open to a brief conversation to discuss this role?

Best regards`;
}

function classifyWithPatterns(text: string): 'interested' | 'not_interested' | 'question' | 'out_of_office' | 'unsubscribe' {
  const lower = text.toLowerCase();
  
  if (lower.match(/interested|love to|yes|definitely|sounds great|tell me more|let's talk|schedule.*call/)) {
    return 'interested';
  }
  if (lower.match(/not interested|no thanks|pass|not looking|happy where|not the right time/)) {
    return 'not_interested';
  }
  if (lower.match(/out of office|vacation|away|ooo|currently unavailable/)) {
    return 'out_of_office';
  }
  if (lower.match(/unsubscribe|remove|stop|opt out|take me off/)) {
    return 'unsubscribe';
  }
  
  return 'question';
}

function generateFallbackJobDescription(title: string, company: string, requirements: string[], benefits: string[]): string {
  return `**${title} at ${company}**

**Role Overview:**
We are seeking a talented ${title} to join our growing team at ${company}. This is an exciting opportunity to make a significant impact on our products and services.

**Key Responsibilities:**
• Design and implement scalable solutions
• Collaborate with cross-functional teams
• Drive technical excellence and best practices
• Mentor junior team members
• Participate in code reviews and architecture decisions

**Requirements:**
${requirements.map(req => `• ${req}`).join('\n')}

**Benefits:**
${benefits.map(benefit => `• ${benefit}`).join('\n')}

Join us in building the future!`;
}

function calculateFallbackScore(candidateSkills: string[], candidateExp: number, jobReqs: string[], requiredExp: number): number {
  const skillMatch = candidateSkills.filter(skill => 
    jobReqs.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  ).length;
  
  const skillScore = jobReqs.length > 0 ? (skillMatch / jobReqs.length) * 5 : 2.5;
  const expScore = requiredExp > 0 ? Math.min(candidateExp / requiredExp, 1) * 5 : 2.5;
  
  return Math.round(skillScore + expScore);
}

function generateFallbackBooleanQuery(jobDescription: string): string {
  const keywords = extractKeywords(jobDescription);
  
  if (keywords.length === 0) return '("software engineer" OR developer)';
  
  const titleKeywords = keywords.filter(k => 
    ['senior', 'lead', 'manager', 'developer', 'engineer', 'architect', 'director'].includes(k.toLowerCase())
  );
  const skillKeywords = keywords.filter(k => !titleKeywords.includes(k));
  
  let query = '';
  if (titleKeywords.length > 0) {
    query += `(${titleKeywords.join(' OR ')})`;
  }
  if (skillKeywords.length > 0) {
    if (query) query += ' AND ';
    query += `(${skillKeywords.slice(0, 5).join(' OR ')})`;
  }
  
  return query;
}

function extractKeywords(text: string): string[] {
  const keywords = text.match(/\b(React|Angular|Vue|Python|Java|JavaScript|TypeScript|AWS|Azure|GCP|Docker|Kubernetes|Senior|Lead|Manager|Developer|Engineer|Architect|Node\.?js|\.NET|C\+\+|C#|Go|Rust|SQL|MongoDB|PostgreSQL|MySQL|Redis|GraphQL|REST|API|Microservices|DevOps|CI\/CD|Agile|Scrum)\b/gi) || [];
  return [...new Set(keywords.map(k => k))];
}

export default openai;