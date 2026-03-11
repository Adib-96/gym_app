import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/supabase-server';
import jwt from 'jsonwebtoken';
import logger from "@/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    logger.info('🔐 Login attempt:', { email, password });

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name, email, password_hash, role, created_at')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!users) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users;
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );


    let clientId = null;
    let coachId = null;

    if (user.role === 'user') {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, coach_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (clientError) {
        throw clientError;
      }

      if (clientData) {
        clientId = clientData.id;
        coachId = clientData.coach_id;
      }
    } else if (user.role === 'coach') {
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (coachError) {
        throw coachError;
      }

      if (coachData) {
        coachId = coachData.id;
      }
    } else if (user.role === 'admin') {
      console.log('👑 Admin login:', user.id);
    }

    console.log('✅ Login successful:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clientId,
        coachId
      }
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // Prevent CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/', // Available on all routes
    });

    // Optional: Set a separate non-HTTP-only cookie for client-side role checking
    response.cookies.set({
      name: 'user_role',
      value: user.role,
      httpOnly: false, // Can be read by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}