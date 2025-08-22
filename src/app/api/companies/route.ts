import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Company } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const industry = searchParams.get('industry');
    const size = searchParams.get('size');
    const hiringUrgency = searchParams.get('hiring_urgency');
    const partnerStatus = searchParams.get('partner_status');
    
    let queryText = `
      SELECT 
        c.*,
        COUNT(DISTINCT j.id) as active_jobs_count,
        COUNT(DISTINCT co.id) as contacts_count
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id AND j.status = 'published'
      LEFT JOIN contacts co ON c.id = co.company_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (industry) {
      queryText += ` AND c.industry = $${paramCounter}`;
      params.push(industry);
      paramCounter++;
    }
    
    if (size) {
      queryText += ` AND c.size = $${paramCounter}`;
      params.push(size);
      paramCounter++;
    }
    
    if (hiringUrgency) {
      queryText += ` AND c.hiring_urgency = $${paramCounter}`;
      params.push(hiringUrgency);
      paramCounter++;
    }
    
    if (partnerStatus) {
      queryText += ` AND c.partner_status = $${paramCounter}`;
      params.push(partnerStatus);
      paramCounter++;
    }
    
    queryText += `
      GROUP BY c.id
      ORDER BY c.hiring_urgency DESC, c.created_at DESC
      LIMIT 50
    `;
    
    const result = await query<Company>(queryText, params);
    
    return NextResponse.json({
      companies: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      domain,
      industry,
      size,
      location,
      hiring_urgency,
      partner_status = 'lead',
      signals = {}
    } = body;
    
    const result = await query<Company>(
      `INSERT INTO companies (
        name, domain, industry, size, location, 
        hiring_urgency, partner_status, signals
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, domain, industry, size, location, hiring_urgency, partner_status, signals]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}