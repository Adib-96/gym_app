// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateResetToken, calculateExpiryDate } from '@/lib/tokens';
import supabase from '@/lib/supabase-server';
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

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

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
    const { error: insertError } = await supabase
      .from('password_reset_tokens')
      .insert([{
        user_id: user.id,
        token,
        expires_at: expires
      }]);

    if (insertError) {
      throw insertError;
    }

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