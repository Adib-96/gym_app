// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Find valid token

    // const resetToken = await prisma.passwordResetToken.findUnique({
    //   where: { token },
    //   include: { user: true },
    // });
    const result = await query(
      'SELECT * FROM password_reset_tokens WHERE token = $1',
      [token]
    );
    const resetToken = result.rows[0];

    // Check if token exists and is not expired
    if (!resetToken || resetToken.expires_at < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password

    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, resetToken.user_id]
    );


    await query(
      'DELETE FROM password_reset_tokens WHERE id = $1',
      [resetToken.id]
    );

    // Optional: Delete all expired tokens for this user
    await query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1 AND expires_at < $2',
      [resetToken.user_id, new Date()]
    );

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}