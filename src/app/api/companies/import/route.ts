import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { companies } = await request.json();
    
    if (!Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json(
        { error: 'Invalid companies data' },
        { status: 400 }
      );
    }

    const results = {
      success: [],
      failed: [],
      total: companies.length
    };

    // Process each company
    for (const company of companies) {
      try {
        // Validate required fields
        if (!company.name) {
          results.failed.push({
            company,
            error: 'Company name is required'
          });
          continue;
        }

        // Check if company already exists by domain or name
        let existingCompany = null;
        if (company.domain) {
          const domainCheck = await query(
            'SELECT id FROM companies WHERE domain = $1',
            [company.domain]
          );
          existingCompany = domainCheck.rows[0];
        }
        
        if (!existingCompany) {
          const nameCheck = await query(
            'SELECT id FROM companies WHERE LOWER(name) = LOWER($1)',
            [company.name]
          );
          existingCompany = nameCheck.rows[0];
        }

        if (existingCompany) {
          // Update existing company
          const updateResult = await query(
            `UPDATE companies SET
              description = COALESCE($1, description),
              industry = COALESCE($2, industry),
              company_size = COALESCE($3, company_size),
              headquarters = COALESCE($4, headquarters),
              website = COALESCE($5, website),
              linkedin_url = COALESCE($6, linkedin_url),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *`,
            [
              company.description,
              company.industry,
              company.company_size,
              company.headquarters,
              company.website || company.domain ? `https://${company.domain}` : null,
              company.linkedin_url,
              existingCompany.id
            ]
          );
          
          results.success.push({
            ...updateResult.rows[0],
            action: 'updated'
          });
        } else {
          // Insert new company
          const insertResult = await query(
            `INSERT INTO companies (
              name, domain, description, industry, company_size,
              headquarters, website, linkedin_url, partner_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
              company.name,
              company.domain,
              company.description,
              company.industry,
              company.company_size,
              company.headquarters,
              company.website || (company.domain ? `https://${company.domain}` : null),
              company.linkedin_url,
              company.partner_status || 'lead'
            ]
          );
          
          results.success.push({
            ...insertResult.rows[0],
            action: 'created'
          });

          // Log activity
          await query(
            `INSERT INTO activities (
              subject_type, subject_id, type, title, description
            ) VALUES ($1, $2, $3, $4, $5)`,
            ['company', insertResult.rows[0].id, 'created', 'Company imported', `Imported ${company.name} via CSV`]
          );
        }
      } catch (error: any) {
        results.failed.push({
          company,
          error: error.message || 'Import failed'
        });
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success.length} successful, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    console.error('Error importing companies:', error);
    return NextResponse.json(
      { error: 'Failed to import companies' },
      { status: 500 }
    );
  }
}