// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateResetToken,calculateExpiryDate } from '@/lib/tokens';
import { query } from '@/lib/db';
import { log } from 'console';
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    // Find user

    const user = await query('SELECT id FROM users WHERE email = $1', [email]);
    log(user.rows[0].id);
    // For security, don't reveal if user exists
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists, you will receive a reset email.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = generateResetToken();
    const expires = calculateExpiryDate();

    //! Store token in database 
    await query(
      'INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES (gen_random_uuid(), $1, $2, $3)',
      [user.rows[0].id, token, expires]
    );

    // Send email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      { message: 'If an account exists, you will receive a reset email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}