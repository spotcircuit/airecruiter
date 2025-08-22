import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('company_id');
    
    let queryText = `
      SELECT 
        c.*,
        comp.name as company_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (companyId) {
      queryText += ` AND c.company_id = $${paramCounter}`;
      params.push(companyId);
      paramCounter++;
    }
    
    queryText += ` ORDER BY c.is_primary DESC, c.created_at DESC LIMIT 100`;
    
    const result = await query(queryText, params);
    
    return NextResponse.json({
      contacts: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_id,
      first_name,
      last_name,
      email,
      phone,
      title,
      linkedin_url,
      is_primary = false,
      notes
    } = body;
    
    const result = await query(
      `INSERT INTO contacts (
        company_id, first_name, last_name, email, phone,
        title, linkedin_url, is_primary, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [company_id, first_name, last_name, email, phone, title, linkedin_url, is_primary, notes]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}