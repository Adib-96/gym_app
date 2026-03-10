// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/supabase-server';

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
    const { data: resetToken, error: selectError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    // Check if token exists and is not expired
    if (!resetToken || new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', resetToken.user_id);

    if (updateError) {
      throw updateError;
    }

    // Delete used token
    const { error: deleteError } = await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('id', resetToken.id);

    if (deleteError) {
      throw deleteError;
    }

    // Optional: Delete all expired tokens for this user
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('user_id', resetToken.user_id)
      .lt('expires_at', new Date().toISOString());

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