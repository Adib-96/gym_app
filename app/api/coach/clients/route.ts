import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Only coaches can access this
  if (user.role !== 'coach') {
    return NextResponse.json(
      { error: 'Only coaches can access client list' },
      { status: 403 }
    );
  }

  try {
    // Get coach's clients
    const clients = await query(
      `SELECT c.id, u.name, u.email, c.date_of_birth, c.gender
       FROM clients c
       JOIN users u ON c.user_id = u.id
       WHERE c.coach_id = $1
       ORDER BY u.name`,
      [user.userId]
    );

    return NextResponse.json({
      success: true,
      clients: clients.rows
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}