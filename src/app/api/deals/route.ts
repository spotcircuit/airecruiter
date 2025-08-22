import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Deal, DealStage } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stage = searchParams.get('stage');
    const companyId = searchParams.get('company_id');
    
    let queryText = `
      SELECT 
        d.*,
        c.name as company_name,
        c.domain as company_domain,
        c.industry as company_industry
      FROM deals d
      LEFT JOIN companies c ON d.company_id = c.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (stage) {
      queryText += ` AND d.stage = $${paramCounter}`;
      params.push(stage);
      paramCounter++;
    }
    
    if (companyId) {
      queryText += ` AND d.company_id = $${paramCounter}`;
      params.push(companyId);
      paramCounter++;
    }
    
    queryText += ` ORDER BY d.updated_at DESC`;
    
    const result = await query(queryText, params);
    
    return NextResponse.json({
      deals: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_id,
      name,
      stage = 'prospect',
      value,
      probability,
      owner_id,
      next_step,
      close_date,
      notes
    } = body;
    
    const result = await query<Deal>(
      `INSERT INTO deals (
        company_id, name, stage, value, probability,
        owner_id, next_step, close_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [company_id, name, stage, value, probability, owner_id, next_step, close_date, notes]
    );
    
    // Log activity
    await query(
      `INSERT INTO activities (
        subject_type, subject_id, type, title, description
      ) VALUES ($1, $2, $3, $4, $5)`,
      ['deal', result.rows[0].id, 'status', 'Deal created', `Deal "${name}" created in ${stage} stage`]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, stage, next_step, value, probability, notes } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }
    
    // Build dynamic update query
    const updates = [];
    const params = [];
    let paramCounter = 1;
    
    if (stage !== undefined) {
      updates.push(`stage = $${paramCounter}`);
      params.push(stage);
      paramCounter++;
    }
    
    if (next_step !== undefined) {
      updates.push(`next_step = $${paramCounter}`);
      params.push(next_step);
      paramCounter++;
    }
    
    if (value !== undefined) {
      updates.push(`value = $${paramCounter}`);
      params.push(value);
      paramCounter++;
    }
    
    if (probability !== undefined) {
      updates.push(`probability = $${paramCounter}`);
      params.push(probability);
      paramCounter++;
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${paramCounter}`);
      params.push(notes);
      paramCounter++;
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (stage === 'won' || stage === 'lost') {
      updates.push(`closed_at = CURRENT_TIMESTAMP`);
    }
    
    params.push(id);
    
    const result = await query<Deal>(
      `UPDATE deals 
       SET ${updates.join(', ')}
       WHERE id = $${paramCounter}
       RETURNING *`,
      params
    );
    
    // Log activity for stage changes
    if (stage) {
      await query(
        `INSERT INTO activities (
          subject_type, subject_id, type, title, description
        ) VALUES ($1, $2, $3, $4, $5)`,
        ['deal', id, 'status', 'Deal stage updated', `Deal moved to ${stage} stage`]
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}