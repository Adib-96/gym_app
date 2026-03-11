import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // 1. Get data from frontend
    const body = await request.json();
    const { name, email, password, role } = body;
    console.log('📝 Registration attempt:', { name, email, role });

    // 2. Basic validation
    if (!name || !email || !password || !role) {
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

    if (!['user', 'coach', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // 3. Check if email already exists
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert user into database
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: hashedPassword,
          role,
        },
      ])
      .select('id, name, email, role, created_at')
      .single();
    if (insertError) {
      throw insertError;
    }

    console.log('✅ User created:', user.id);

    // 6. If user registered as 'user', create client record
    if (role === 'user') {
      console.log('Creating client record for user:', user.id);

      const { error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            user_id: user.id,
            date_of_birth: null,
            gender: null,
            health_notes: null,
          },
        ]);

      if (clientError) {
        console.error('⚠️ Client creation error:', clientError);
      } else {
        console.log('✅ Client created');
      }
    }

    // 7. If user registered as 'coach', create coach record
    else if (role === 'coach') {
      console.log('Creating coach record for user:', user.id);

      const { error: coachError } = await supabase
        .from('coaches')
        .insert([
          {
            user_id: user.id,
            bio: '',
            certification: '',
          },
        ]);

      if (coachError) {
        throw coachError;
      }

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
        role: user.role,
      },
    });

  } catch (error) {
    console.error('❌ Registration error:', error);

    let errorMessage = 'Internal server error. Please try again.';

    // Supabase/Postgres error handling
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505') {
      errorMessage = 'Email already registered';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Register API is working',
    endpoint: '/api/auth/register',
    methods: ['POST', 'GET']
  });
}
