import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const companyId = searchParams.get('company_id');
    
    let queryText = `
      SELECT 
        j.*,
        c.name as company_name,
        c.domain as company_domain
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (status) {
      queryText += ` AND j.status = $${paramCounter}`;
      params.push(status);
      paramCounter++;
    }
    
    if (companyId) {
      queryText += ` AND j.company_id = $${paramCounter}`;
      params.push(companyId);
      paramCounter++;
    }
    
    queryText += ` ORDER BY j.created_at DESC`;
    
    const result = await query(queryText, params);
    
    return NextResponse.json({
      jobs: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_id,
      title,
      department,
      location,
      location_type,
      employment_type,
      experience_level,
      salary_min,
      salary_max,
      jd_text,
      requirements,
      nice_to_haves,
      status = 'draft'
    } = body;
    
    const result = await query(
      `INSERT INTO jobs (
        company_id, title, department, location, location_type,
        employment_type, experience_level, salary_min, salary_max,
        jd_text, requirements, nice_to_haves, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        company_id, title, department, location, location_type,
        employment_type, experience_level, salary_min, salary_max,
        jd_text, requirements, nice_to_haves, status
      ]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}