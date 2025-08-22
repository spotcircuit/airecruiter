import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Helper function to extract text patterns
function extractPattern(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  return match ? match[0] : null;
}

// Extract years of experience from text
function extractYearsExperience(text: string): number {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
    /experience[:\s]+(\d+)\+?\s*years?/i,
    /(\d+)\s*years?\s*professional/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
  }
  
  // Try to calculate from work history dates
  const yearMatches = text.match(/20\d{2}/g);
  if (yearMatches && yearMatches.length >= 2) {
    const years = yearMatches.map(y => parseInt(y)).sort();
    return new Date().getFullYear() - years[0];
  }
  
  return 0;
}

// Extract skills from text
function extractSkills(text: string): string[] {
  const skillKeywords = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Scala', 'R',
    
    // Frontend
    'React', 'Angular', 'Vue', 'Svelte', 'Next.js', 'Nuxt', 'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'Material-UI',
    
    // Backend
    'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'Rails', '.NET', 'Laravel',
    
    // Databases
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'Neo4j',
    
    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible', 'Linux',
    
    // Data & AI
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP',
    
    // Other
    'GraphQL', 'REST', 'API', 'Git', 'Agile', 'Scrum', 'Microservices', 'WebSockets', 'OAuth', 'JWT'
  ];
  
  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  });
  
  return Array.from(foundSkills);
}

// Parse work experience sections
function extractExperience(text: string): any[] {
  const experiences = [];
  
  // Common job title keywords
  const titleKeywords = [
    'engineer', 'developer', 'architect', 'manager', 'director', 'lead',
    'analyst', 'consultant', 'specialist', 'coordinator', 'designer'
  ];
  
  // Split text into lines and look for experience patterns
  const lines = text.split('\n');
  let currentExp: any = null;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if line contains a job title
    const hasTitle = titleKeywords.some(keyword => lowerLine.includes(keyword));
    const hasDate = /\d{4}/.test(line);
    
    if (hasTitle && hasDate) {
      if (currentExp) {
        experiences.push(currentExp);
      }
      
      currentExp = {
        title: line.trim(),
        company: '',
        description: ''
      };
    } else if (currentExp && line.trim()) {
      currentExp.description += line.trim() + ' ';
    }
  }
  
  if (currentExp) {
    experiences.push(currentExp);
  }
  
  // Return at most 5 experiences
  return experiences.slice(0, 5);
}

// Generate embedding vector (mock - in production use OpenAI)
async function generateEmbedding(text: string): Promise<number[]> {
  // In production, this would call OpenAI's embedding API
  // For now, generate a mock 1536-dimensional vector
  const vector = [];
  for (let i = 0; i < 1536; i++) {
    // Generate deterministic values based on text
    const charCode = text.charCodeAt(i % text.length) || 0;
    vector.push((Math.sin(charCode * (i + 1)) + 1) / 2);
  }
  return vector;
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

    // Read file content
    const text = await file.text();
    
    // Extract email
    const emailPattern = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/;
    const email = extractPattern(text, emailPattern);
    
    // Extract phone
    const phonePattern = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/;
    const phone = extractPattern(text, phonePattern);
    
    // Extract LinkedIn URL
    const linkedinPattern = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;
    const linkedinUrl = extractPattern(text, linkedinPattern);
    
    // Extract GitHub URL
    const githubPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i;
    const githubUrl = extractPattern(text, githubPattern);
    
    // Extract name (usually at the beginning)
    const lines = text.split('\n').filter(l => l.trim());
    const potentialName = lines[0]?.trim() || '';
    const nameParts = potentialName.split(/\s+/);
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'Candidate';
    
    // Extract location (look for city, state patterns)
    const locationPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),?\s*([A-Z]{2})/;
    const locationMatch = text.match(locationPattern);
    const location = locationMatch ? `${locationMatch[1]}, ${locationMatch[2]}` : null;
    
    // Extract skills
    const skills = extractSkills(text);
    
    // Extract years of experience
    const yearsExperience = extractYearsExperience(text);
    
    // Extract experience
    const experience = extractExperience(text);
    
    // Generate embedding for the entire resume
    const embedding = await generateEmbedding(text);
    
    // Create a summary
    const summary = `Experienced professional with ${yearsExperience} years of experience. ` +
                   `Key skills include ${skills.slice(0, 5).join(', ')}.`;
    
    // Prepare the parsed data
    const parsedData = {
      firstName,
      lastName,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone,
      location,
      currentTitle: experience[0]?.title || 'Professional',
      currentCompany: experience[0]?.company || null,
      yearsExperience,
      skills,
      experience: experience.slice(0, 3),
      education: [], // Would need more sophisticated parsing
      linkedinUrl,
      githubUrl,
      summary,
      rawText: text.substring(0, 5000),
      embedding
    };
    
    // Store in database if email doesn't exist
    if (email) {
      const existingCandidate = await query(
        'SELECT id FROM candidates WHERE email = $1',
        [email]
      );
      
      if (existingCandidate.rows.length === 0) {
        // Insert new candidate with embedding
        const result = await query(
          `INSERT INTO candidates (
            first_name, last_name, email, phone, location,
            current_title, current_company, years_experience,
            skills, linkedin_url, github_url, notes,
            resume_text, resume_embedding
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING id`,
          [
            firstName,
            lastName,
            email,
            phone,
            location,
            parsedData.currentTitle,
            parsedData.currentCompany,
            yearsExperience,
            skills,
            linkedinUrl,
            githubUrl,
            summary,
            text.substring(0, 10000), // Store first 10k chars
            `[${embedding.slice(0, 100).join(',')}]` // Store first 100 dims for demo
          ]
        );
        
        parsedData['candidateId'] = result.rows[0].id;
      }
    }
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}