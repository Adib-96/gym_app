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
      `SELECT 
        c.id, 
        u.id as user_id,
        u.name, 
        u.email, 
        c.date_of_birth, 
        c.gender,
        c.height,
        c.weight,
        c.fitness_level,
        c.goals,
        c.status,
        c.created_at
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

export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (user.role !== 'coach') {
    return NextResponse.json(
      { error: 'Only coaches can add clients' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userResult = await query(
      `SELECT id, role FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User with this email does not exist' },
        { status: 404 }
      );
    }

    const clientUser = userResult.rows[0];

    // Check if user is already a client or coach
    if (clientUser.role === 'coach') {
      return NextResponse.json(
        { error: 'Cannot add a coach as a client' },
        { status: 400 }
      );
    }

    // Check if already assigned to a coach
    const existingClient = await query(
      `SELECT id FROM clients WHERE user_id = $1`,
      [clientUser.id]
    );

    if (existingClient.rows.length > 0) {
      return NextResponse.json(
        { error: 'User is already a client' },
        { status: 400 }
      );
    }

    // Create client record
    const newClient = await query(
      `INSERT INTO clients (user_id, coach_id, status, created_at, updated_at)
       VALUES ($1, $2, 'Active', NOW(), NOW())
       RETURNING id`,
      [clientUser.id, user.userId]
    );

    return NextResponse.json({
      success: true,
      clientId: newClient.rows[0].id
    });

  } catch (error) {
    console.error('Error adding client:', error);
    return NextResponse.json(
      { error: 'Failed to add client' },
      { status: 500 }
    );
  }
}