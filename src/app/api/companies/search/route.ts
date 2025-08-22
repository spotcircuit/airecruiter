import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('q');
    
    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json({ companies: [] });
    }
    
    const result = await query(
      `SELECT id, name, domain, industry 
       FROM companies 
       WHERE LOWER(name) LIKE LOWER($1)
       ORDER BY name
       LIMIT 10`,
      [`%${searchTerm}%`]
    );
    
    return NextResponse.json({
      companies: result.rows
    });
  } catch (error) {
    console.error('Error searching companies:', error);
    return NextResponse.json(
      { error: 'Failed to search companies' },
      { status: 500 }
    );
  }
}