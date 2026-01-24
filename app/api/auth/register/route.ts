import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 1. Get data from frontend
    const body = await request.json();
    const { name, email, password, role } = body;

    console.log('📝 Registration attempt:', { name, email, role });

    // 2. Basic validation
    if (!name || !email || !password || !role) {
      console.log('Missing fields:', { name, email, password, role });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!['user', 'coach'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // 3. Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert user into database
    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role] // Use role directly
    );

    const user = userResult.rows[0];
    console.log('✅ User created in database:', user.id);

    // 6. If user registered as 'user', create client record
    if (role === 'user') {
      console.log('Creating client record for user:', user.id);
      
      try {
        // Find a coach to assign (or use NULL for now)
        const coaches = await query('SELECT id FROM coaches LIMIT 1');
        const defaultCoachId = coaches.rows[0]?.id;
        
        if (defaultCoachId) {
          await query(
            `INSERT INTO clients (user_id, coach_id, date_of_birth, gender) 
             VALUES ($1, $2, NULL, NULL)`,
            [user.id, defaultCoachId]
          );
          console.log('✅ Client assigned to coach:', defaultCoachId);
        } else {
          // No coaches yet, create client without coach (coach_id can be NULL)
          await query(
            `INSERT INTO clients (user_id, date_of_birth, gender) 
             VALUES ($1, NULL, NULL)`,
            [user.id]
          );
          console.log('✅ Client created without coach assignment');
        }
      } catch (clientError) {
        console.error('⚠️ Client creation error:', clientError);
        // Don't fail registration if client creation fails
        // User can still log in and choose a coach later
      }
    }
    
    // 7. If user registered as 'coach', create coach record
    else if (role === 'coach') {
      console.log('Creating coach record for user:', user.id);
      await query(
        'INSERT INTO coaches (user_id, bio, certification) VALUES ($1, $2, $3)',
        [user.id, '', '']
      );
      console.log('✅ Coach record created');
    }

    // 8. Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // This will be 'user' or 'coach'
      }
    });

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    // More specific error messages
    let errorMessage = 'Internal server error. Please try again.';
    if (error.code === '23505') { // PostgreSQL unique violation
      errorMessage = 'Email already registered';
    } else if (error.code === '23503') { // Foreign key violation
      errorMessage = 'Database constraint error';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Register API is working',
    endpoint: '/api/auth/register',
    methods: ['POST', 'GET']
  });
}