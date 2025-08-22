import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (normA * normB);
}

// Generate query embedding from search terms
async function generateQueryEmbedding(query: string): Promise<number[]> {
  // In production, this would call OpenAI's embedding API
  // For now, generate a mock embedding based on query
  const vector = [];
  for (let i = 0; i < 1536; i++) {
    const charCode = query.charCodeAt(i % query.length) || 0;
    vector.push((Math.sin(charCode * (i + 1)) + 1) / 2);
  }
  return vector;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query: searchQuery,
      skills,
      yearsExperience,
      location,
      useSemanticSearch = false,
      limit = 20
    } = body;

    if (useSemanticSearch && searchQuery) {
      // Semantic search using embeddings
      const queryEmbedding = await generateQueryEmbedding(searchQuery);
      
      // For demo, we'll do standard SQL search with scoring
      // In production with pgvector, we'd use: ORDER BY resume_embedding <-> $1
      let sqlQuery = `
        SELECT 
          c.*,
          CASE 
            WHEN resume_text IS NOT NULL THEN 1
            ELSE 0
          END as has_resume,
          0 as similarity_score
        FROM candidates c
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramCounter = 1;
      
      // Add text search
      if (searchQuery) {
        sqlQuery += ` AND (
          LOWER(c.first_name || ' ' || c.last_name) LIKE LOWER($${paramCounter})
          OR LOWER(c.current_title) LIKE LOWER($${paramCounter})
          OR LOWER(c.skills::text) LIKE LOWER($${paramCounter})
          OR LOWER(c.notes) LIKE LOWER($${paramCounter})
          OR LOWER(c.resume_text) LIKE LOWER($${paramCounter})
        )`;
        params.push(`%${searchQuery}%`);
        paramCounter++;
      }
      
      sqlQuery += ` ORDER BY has_resume DESC, c.created_at DESC LIMIT $${paramCounter}`;
      params.push(limit);
      
      const result = await query(sqlQuery, params);
      
      // Calculate similarity scores for candidates with embeddings
      const candidatesWithScores = result.rows.map(candidate => {
        // Mock similarity calculation
        let score = 0;
        
        // Boost score based on matching criteria
        if (searchQuery) {
          const searchTerms = searchQuery.toLowerCase().split(' ');
          const candidateText = `${candidate.first_name} ${candidate.last_name} ${candidate.current_title} ${candidate.skills?.join(' ')}`.toLowerCase();
          
          searchTerms.forEach(term => {
            if (candidateText.includes(term)) {
              score += 0.1;
            }
          });
        }
        
        if (skills && Array.isArray(skills)) {
          const candidateSkills = candidate.skills || [];
          skills.forEach(skill => {
            if (candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))) {
              score += 0.15;
            }
          });
        }
        
        if (yearsExperience && candidate.years_experience) {
          const diff = Math.abs(candidate.years_experience - yearsExperience);
          if (diff === 0) score += 0.3;
          else if (diff <= 2) score += 0.2;
          else if (diff <= 5) score += 0.1;
        }
        
        if (location && candidate.location) {
          if (candidate.location.toLowerCase().includes(location.toLowerCase())) {
            score += 0.2;
          }
        }
        
        return {
          ...candidate,
          similarity_score: Math.min(score, 1) // Cap at 1.0
        };
      });
      
      // Sort by similarity score
      candidatesWithScores.sort((a, b) => b.similarity_score - a.similarity_score);
      
      return NextResponse.json({
        candidates: candidatesWithScores,
        total: candidatesWithScores.length,
        searchType: 'semantic'
      });
      
    } else {
      // Traditional keyword search
      let sqlQuery = `
        SELECT c.*
        FROM candidates c
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramCounter = 1;
      
      if (searchQuery) {
        sqlQuery += ` AND (
          LOWER(c.first_name || ' ' || c.last_name) LIKE LOWER($${paramCounter})
          OR LOWER(c.current_title) LIKE LOWER($${paramCounter})
          OR LOWER(c.current_company) LIKE LOWER($${paramCounter})
        )`;
        params.push(`%${searchQuery}%`);
        paramCounter++;
      }
      
      if (skills && Array.isArray(skills) && skills.length > 0) {
        // Check if any skill matches
        const skillConditions = skills.map((_, index) => {
          const idx = paramCounter + index;
          return `c.skills::text ILIKE $${idx}`;
        });
        sqlQuery += ` AND (${skillConditions.join(' OR ')})`;
        skills.forEach(skill => params.push(`%${skill}%`));
        paramCounter += skills.length;
      }
      
      if (yearsExperience) {
        sqlQuery += ` AND c.years_experience >= $${paramCounter}`;
        params.push(yearsExperience);
        paramCounter++;
      }
      
      if (location) {
        sqlQuery += ` AND LOWER(c.location) LIKE LOWER($${paramCounter})`;
        params.push(`%${location}%`);
        paramCounter++;
      }
      
      sqlQuery += ` ORDER BY c.created_at DESC LIMIT $${paramCounter}`;
      params.push(limit);
      
      const result = await query(sqlQuery, params);
      
      return NextResponse.json({
        candidates: result.rows,
        total: result.rowCount,
        searchType: 'keyword'
      });
    }
  } catch (error) {
    console.error('Error searching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to search candidates' },
      { status: 500 }
    );
  }
}