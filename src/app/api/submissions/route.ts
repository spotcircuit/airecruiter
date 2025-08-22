import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('job_id');
    const candidateId = searchParams.get('candidate_id');
    const status = searchParams.get('status');
    const stage = searchParams.get('stage');
    
    let queryText = `
      SELECT 
        s.*,
        c.first_name || ' ' || c.last_name as candidate_name,
        c.email as candidate_email,
        c.current_title as candidate_title,
        j.title as job_title,
        j.company_id,
        comp.name as company_name
      FROM submissions s
      LEFT JOIN candidates c ON s.candidate_id = c.id
      LEFT JOIN jobs j ON s.job_id = j.id
      LEFT JOIN companies comp ON j.company_id = comp.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (jobId) {
      queryText += ` AND s.job_id = $${paramCounter}`;
      params.push(jobId);
      paramCounter++;
    }
    
    if (candidateId) {
      queryText += ` AND s.candidate_id = $${paramCounter}`;
      params.push(candidateId);
      paramCounter++;
    }
    
    if (status) {
      queryText += ` AND s.status = $${paramCounter}`;
      params.push(status);
      paramCounter++;
    }
    
    if (stage) {
      queryText += ` AND s.stage = $${paramCounter}`;
      params.push(stage);
      paramCounter++;
    }
    
    queryText += ` ORDER BY s.created_at DESC LIMIT 100`;
    
    const result = await query(queryText, params);
    
    return NextResponse.json({
      submissions: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      job_id,
      candidate_id,
      match_score,
      match_reasons,
      brief_md,
      status = 'draft',
      stage = 'new',
      notes
    } = body;
    
    const result = await query(
      `INSERT INTO submissions (
        job_id, candidate_id, match_score, match_reasons,
        brief_md, status, stage, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (job_id, candidate_id) 
      DO UPDATE SET 
        match_score = EXCLUDED.match_score,
        match_reasons = EXCLUDED.match_reasons,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [job_id, candidate_id, match_score, match_reasons, brief_md, status, stage, notes]
    );
    
    // Log activity
    await query(
      `INSERT INTO activities (
        subject_type, subject_id, type, title, description
      ) VALUES ($1, $2, $3, $4, $5)`,
      ['submission', result.rows[0].id, 'status', 'Submission created', `New submission for candidate to job`]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, stage, status, notes } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }
    
    const updates = [];
    const params = [];
    let paramCounter = 1;
    
    if (stage !== undefined) {
      updates.push(`stage = $${paramCounter}`);
      params.push(stage);
      paramCounter++;
    }
    
    if (status !== undefined) {
      updates.push(`status = $${paramCounter}`);
      params.push(status);
      paramCounter++;
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${paramCounter}`);
      params.push(notes);
      paramCounter++;
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Update timestamps based on stage changes
    if (stage === 'interviewed') {
      updates.push(`interviewed_at = CURRENT_TIMESTAMP`);
    } else if (stage === 'offered') {
      updates.push(`offered_at = CURRENT_TIMESTAMP`);
    }
    
    params.push(id);
    
    const result = await query(
      `UPDATE submissions 
       SET ${updates.join(', ')}
       WHERE id = $${paramCounter}
       RETURNING *`,
      params
    );
    
    // Log activity
    if (stage) {
      await query(
        `INSERT INTO activities (
          subject_type, subject_id, type, title, description
        ) VALUES ($1, $2, $3, $4, $5)`,
        ['submission', id, 'status', 'Stage updated', `Submission moved to ${stage} stage`]
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}