import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { jd_text, requirements, nice_to_haves, exclude, locations } = await request.json();
    
    if (!jd_text && !requirements) {
      return NextResponse.json(
        { error: 'Job description or requirements are required' },
        { status: 400 }
      );
    }
    
    // Parse requirements from JD if not provided
    const mustHaveTerms = requirements || extractKeyTerms(jd_text, 'required');
    const bonusTerms = nice_to_haves || extractKeyTerms(jd_text, 'bonus');
    const excludeTerms = exclude || [];
    
    // Generate Boolean queries for different platforms
    const queries = {
      linkedin: generateLinkedInBoolean(mustHaveTerms, bonusTerms, excludeTerms, locations),
      google: generateGoogleBoolean(mustHaveTerms, bonusTerms, excludeTerms, locations),
      indeed: generateIndeedBoolean(mustHaveTerms, bonusTerms, excludeTerms, locations),
      github: generateGitHubBoolean(mustHaveTerms, bonusTerms),
    };
    
    return NextResponse.json({
      queries,
      parameters: {
        must: mustHaveTerms,
        bonus: bonusTerms,
        exclude: excludeTerms,
        locations: locations || []
      },
      tips: [
        'Use quotation marks for exact phrases (e.g., "machine learning")',
        'Adjust terms based on initial results',
        'Consider industry-specific synonyms',
        'Test queries with different combinations'
      ]
    });
  } catch (error) {
    console.error('Error generating Boolean query:', error);
    return NextResponse.json(
      { error: 'Failed to generate Boolean query' },
      { status: 500 }
    );
  }
}

function extractKeyTerms(jdText: string, type: 'required' | 'bonus'): string[] {
  if (!jdText) return [];
  
  const terms: string[] = [];
  const text = jdText.toLowerCase();
  
  // Common patterns for requirements
  const requiredPatterns = [
    /required:?\s*([^\.]+)/gi,
    /must have:?\s*([^\.]+)/gi,
    /requirements:?\s*([^\.]+)/gi,
    /qualified candidates will have:?\s*([^\.]+)/gi,
  ];
  
  const bonusPatterns = [
    /nice to have:?\s*([^\.]+)/gi,
    /preferred:?\s*([^\.]+)/gi,
    /bonus:?\s*([^\.]+)/gi,
    /plus:?\s*([^\.]+)/gi,
  ];
  
  const patterns = type === 'required' ? requiredPatterns : bonusPatterns;
  
  // Extract skills from common technology terms
  const techTerms = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring', 'rails',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
    'postgresql', 'mongodb', 'redis', 'elasticsearch', 'mysql', 'oracle',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'ai',
    'agile', 'scrum', 'devops', 'ci/cd', 'microservices', 'rest api', 'graphql'
  ];
  
  // Check for tech terms in the text
  techTerms.forEach(term => {
    if (text.includes(term)) {
      terms.push(term);
    }
  });
  
  // Extract years of experience
  const expMatch = text.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i);
  if (expMatch && type === 'required') {
    terms.push(`${expMatch[1]}+ years experience`);
  }
  
  // Limit to top 8 terms for better query performance
  return Array.from(new Set(terms)).slice(0, 8);
}

function generateLinkedInBoolean(
  must: string[],
  bonus: string[],
  exclude: string[],
  locations: string[]
): string {
  let query = '';
  
  // Must-have skills (AND)
  if (must.length > 0) {
    query += must.map(term => `"${term}"`).join(' AND ');
  }
  
  // Bonus skills (OR)
  if (bonus.length > 0) {
    const bonusQuery = bonus.map(term => `"${term}"`).join(' OR ');
    query += query ? ` AND (${bonusQuery})` : bonusQuery;
  }
  
  // Exclude terms (NOT)
  if (exclude.length > 0) {
    query += ' NOT (' + exclude.map(term => `"${term}"`).join(' OR ') + ')';
  }
  
  // Location filter
  if (locations.length > 0) {
    query += ' AND (' + locations.map(loc => `"${loc}"`).join(' OR ') + ')';
  }
  
  return query || 'Enter job requirements to generate query';
}

function generateGoogleBoolean(
  must: string[],
  bonus: string[],
  exclude: string[],
  locations: string[]
): string {
  let query = 'site:linkedin.com/in OR site:github.com';
  
  // Must-have skills
  if (must.length > 0) {
    query += ' ' + must.map(term => `"${term}"`).join(' ');
  }
  
  // Bonus skills
  if (bonus.length > 0) {
    query += ' (' + bonus.map(term => `"${term}"`).join(' OR ') + ')';
  }
  
  // Exclude terms
  if (exclude.length > 0) {
    exclude.forEach(term => {
      query += ` -"${term}"`;
    });
  }
  
  // Location
  if (locations.length > 0) {
    query += ' (' + locations.map(loc => `"${loc}"`).join(' OR ') + ')';
  }
  
  // Add resume/CV keywords
  query += ' (resume OR CV OR profile)';
  
  return query;
}

function generateIndeedBoolean(
  must: string[],
  bonus: string[],
  exclude: string[],
  locations: string[]
): string {
  let query = 'resume ';
  
  // Must-have skills
  if (must.length > 0) {
    query += must.map(term => `"${term}"`).join(' ');
  }
  
  // Bonus skills (Indeed uses OR within parentheses)
  if (bonus.length > 0) {
    query += ' (' + bonus.join(' OR ') + ')';
  }
  
  // Exclude terms (Indeed uses NOT)
  if (exclude.length > 0) {
    exclude.forEach(term => {
      query += ` NOT ${term}`;
    });
  }
  
  return query;
}

function generateGitHubBoolean(must: string[], bonus: string[]): string {
  let query = '';
  
  // GitHub search is simpler
  if (must.length > 0) {
    query += must.join(' ');
  }
  
  if (bonus.length > 0) {
    query += ' ' + bonus.join(' OR ');
  }
  
  // Add language/location qualifiers
  query += ' language:* location:*';
  
  return query || 'Enter skills to search GitHub profiles';
}