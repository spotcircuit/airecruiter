import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    
    // Delete the deal
    const result = await query(
      'DELETE FROM deals WHERE id = $1 RETURNING *',
      [dealId]
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    // Log activity
    await query(
      `INSERT INTO activities (
        subject_type, subject_id, type, title, description
      ) VALUES ($1, $2, $3, $4, $5)`,
      ['deal', dealId, 'status', 'Deal deleted', `Deal was deleted`]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}