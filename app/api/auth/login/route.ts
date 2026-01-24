import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Login attempt:', { email });

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const userResult = await query(
      `SELECT id, name, email, password_hash, role, created_at 
       FROM users WHERE email = $1`,
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

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

    // Get additional info
    let additionalInfo = {};
    let clientId = null;
    let coachId = null;
    
    if (user.role === 'user') {
      const clientResult = await query(
        'SELECT id as client_id, coach_id FROM clients WHERE user_id = $1',
        [user.id]
      );
      if (clientResult.rows.length > 0) {
        clientId = clientResult.rows[0].client_id;
        coachId = clientResult.rows[0].coach_id;
      }
    } else if (user.role === 'coach') {
      const coachResult = await query(
        'SELECT id as coach_id FROM coaches WHERE user_id = $1',
        [user.id]
      );
      if (coachResult.rows.length > 0) {
        coachId = coachResult.rows[0].coach_id;
      }
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

  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}