import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/candidates/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await query(
      `
      SELECT 
        c.*,
        COUNT(s.id) as submission_count
      FROM candidates c
      LEFT JOIN submissions s ON c.id = s.candidate_id
      WHERE c.id = $1
      GROUP BY c.id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 });
  }
}
