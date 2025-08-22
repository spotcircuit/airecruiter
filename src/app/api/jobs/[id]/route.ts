import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await query(
      `SELECT 
        j.*,
        c.name as company_name,
        c.domain as company_domain,
        c.industry as company_industry
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
      status
    } = body;
    
    const result = await query(
      `UPDATE jobs SET
        company_id = $1,
        title = $2,
        department = $3,
        location = $4,
        location_type = $5,
        employment_type = $6,
        experience_level = $7,
        salary_min = $8,
        salary_max = $9,
        jd_text = $10,
        requirements = $11,
        nice_to_haves = $12,
        status = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *`,
      [
        company_id, title, department, location, location_type,
        employment_type, experience_level, salary_min, salary_max,
        jd_text, requirements, nice_to_haves, status, id
      ]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await query(
      'DELETE FROM jobs WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}