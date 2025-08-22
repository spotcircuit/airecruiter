import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get company details
    const companyResult = await query(
      `SELECT * FROM companies WHERE id = $1`,
      [params.id]
    );
    
    if (companyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    const company = companyResult.rows[0];
    
    // Get related data in parallel
    const [jobsResult, contactsResult, dealsResult] = await Promise.all([
      query(
        `SELECT * FROM jobs WHERE company_id = $1 ORDER BY created_at DESC`,
        [params.id]
      ),
      query(
        `SELECT * FROM contacts WHERE company_id = $1 ORDER BY is_primary DESC, created_at DESC`,
        [params.id]
      ),
      query(
        `SELECT * FROM deals WHERE company_id = $1 ORDER BY created_at DESC`,
        [params.id]
      )
    ]);
    
    return NextResponse.json({
      company,
      jobs: jobsResult.rows,
      contacts: contactsResult.rows,
      deals: dealsResult.rows
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      domain,
      industry,
      size,
      location,
      headquarters,
      description,
      hiring_urgency,
      hiring_volume,
      growth_stage,
      funding_amount,
      website_url,
      linkedin_url,
      partner_status
    } = body;
    
    const result = await query(
      `UPDATE companies SET
        name = $1,
        domain = $2,
        industry = $3,
        size = $4,
        location = $5,
        headquarters = $6,
        description = $7,
        hiring_urgency = $8,
        hiring_volume = $9,
        growth_stage = $10,
        funding_amount = $11,
        website_url = $12,
        linkedin_url = $13,
        partner_status = $14,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *`,
      [
        name, domain, industry, size, location, headquarters, description,
        hiring_urgency, hiring_volume, growth_stage, funding_amount,
        website_url, linkedin_url, partner_status, params.id
      ]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      'DELETE FROM companies WHERE id = $1 RETURNING *',
      [params.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}