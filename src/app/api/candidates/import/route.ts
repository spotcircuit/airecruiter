import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { candidates } = await request.json();
    
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json(
        { error: 'Invalid candidates data' },
        { status: 400 }
      );
    }

    const results = {
      success: [],
      failed: [],
      total: candidates.length
    };

    // Process each candidate
    for (const candidate of candidates) {
      try {
        // Validate required fields
        if (!candidate.first_name || !candidate.last_name || !candidate.email) {
          results.failed.push({
            candidate,
            error: 'First name, last name, and email are required'
          });
          continue;
        }

        // Check if candidate already exists by email
        const existingCandidate = await query(
          'SELECT id FROM candidates WHERE email = $1',
          [candidate.email]
        );

        if (existingCandidate.rows.length > 0) {
          // Update existing candidate
          const updateResult = await query(
            `UPDATE candidates SET
              phone = COALESCE($1, phone),
              current_title = COALESCE($2, current_title),
              current_company = COALESCE($3, current_company),
              location = COALESCE($4, location),
              years_experience = COALESCE($5, years_experience),
              skills = COALESCE($6, skills),
              linkedin_url = COALESCE($7, linkedin_url),
              github_url = COALESCE($8, github_url),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *`,
            [
              candidate.phone,
              candidate.current_title,
              candidate.current_company,
              candidate.location,
              candidate.years_experience ? parseInt(candidate.years_experience) : null,
              candidate.skills ? (Array.isArray(candidate.skills) ? candidate.skills : candidate.skills.split(',').map(s => s.trim())) : null,
              candidate.linkedin_url,
              candidate.github_url,
              existingCandidate.rows[0].id
            ]
          );
          
          results.success.push({
            ...updateResult.rows[0],
            action: 'updated'
          });
        } else {
          // Insert new candidate
          const insertResult = await query(
            `INSERT INTO candidates (
              first_name, last_name, email, phone, current_title,
              current_company, location, years_experience, skills,
              linkedin_url, github_url, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
              candidate.first_name,
              candidate.last_name,
              candidate.email,
              candidate.phone,
              candidate.current_title,
              candidate.current_company,
              candidate.location,
              candidate.years_experience ? parseInt(candidate.years_experience) : null,
              candidate.skills ? (Array.isArray(candidate.skills) ? candidate.skills : candidate.skills.split(',').map(s => s.trim())) : null,
              candidate.linkedin_url,
              candidate.github_url,
              candidate.status || 'new'
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
            ['candidate', insertResult.rows[0].id, 'created', 'Candidate imported', `Imported ${candidate.first_name} ${candidate.last_name} via CSV`]
          );
        }
      } catch (error: any) {
        results.failed.push({
          candidate,
          error: error.message || 'Import failed'
        });
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success.length} successful, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    console.error('Error importing candidates:', error);
    return NextResponse.json(
      { error: 'Failed to import candidates' },
      { status: 500 }
    );
  }
}