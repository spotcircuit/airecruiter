import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      linkedin,
      current_role,
      experience,
      message,
      job_id,
      company_id,
      source = 'widget'
    } = body;
    
    // Parse name into first and last
    const nameParts = name?.split(' ') || [];
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';
    
    // Parse years of experience
    let years_experience = null;
    if (experience) {
      if (experience === '0-2') years_experience = 1;
      else if (experience === '3-5') years_experience = 4;
      else if (experience === '6-10') years_experience = 8;
      else if (experience === '10+') years_experience = 12;
    }
    
    // Create candidate
    const candidateResult = await query(
      `INSERT INTO candidates (
        first_name, last_name, email, phone, 
        current_title, linkedin_url, years_experience,
        source, source_details, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (email) DO UPDATE SET
        phone = COALESCE(EXCLUDED.phone, candidates.phone),
        current_title = COALESCE(EXCLUDED.current_title, candidates.current_title),
        linkedin_url = COALESCE(EXCLUDED.linkedin_url, candidates.linkedin_url),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone,
        current_role,
        linkedin,
        years_experience,
        source,
        JSON.stringify({ job_id, company_id, widget_submission: true }),
        message
      ]
    );
    
    const candidate = candidateResult.rows[0];
    
    // If job_id provided, create a submission
    if (job_id && candidate) {
      await query(
        `INSERT INTO submissions (
          job_id, candidate_id, status, stage, notes
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (job_id, candidate_id) DO NOTHING`,
        [job_id, candidate.id, 'draft', 'new', 'Submitted via widget']
      );
    }
    
    // Log activity
    await query(
      `INSERT INTO activities (
        subject_type, subject_id, type, title, description
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        'candidate',
        candidate.id,
        'note',
        'Widget submission',
        `${name} submitted profile via embedded widget`
      ]
    );
    
    // Return success with CORS headers for embedded widget
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        candidate_id: candidate.id,
        message: 'Application received successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error processing widget intake:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process application' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}