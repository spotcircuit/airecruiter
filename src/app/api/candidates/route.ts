import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const skills = searchParams.get('skills');
    
    let queryText = `
      SELECT 
        c.*,
        COUNT(s.id) as submission_count
      FROM candidates c
      LEFT JOIN submissions s ON c.id = s.candidate_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (source) {
      queryText += ` AND c.source = $${paramCounter}`;
      params.push(source);
      paramCounter++;
    }
    
    if (skills) {
      // Search for candidates with any of the specified skills
      queryText += ` AND c.skills && $${paramCounter}`;
      params.push(skills.split(','));
      paramCounter++;
    }
    
    queryText += `
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 100
    `;
    
    const result = await query(queryText, params);
    
    return NextResponse.json({
      candidates: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      location,
      current_title,
      current_company,
      years_experience,
      resume_url,
      linkedin_url,
      skills,
      source,
      expected_salary_min,
      expected_salary_max
    } = body;
    
    const result = await query(
      `INSERT INTO candidates (
        first_name, last_name, email, phone, location,
        current_title, current_company, years_experience,
        resume_url, linkedin_url, skills, source,
        expected_salary_min, expected_salary_max
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        first_name, last_name, email, phone, location,
        current_title, current_company, years_experience,
        resume_url, linkedin_url, skills, source,
        expected_salary_min, expected_salary_max
      ]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}