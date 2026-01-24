import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

// This route requires authentication
export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized: ' + error },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: `Welcome ${user.email}!`,
    user: user,
    data: 'This is protected data',
  });
}

// Example: Create workout (coach only)
export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if user is a coach
  if (user.role !== 'coach') {
    return NextResponse.json(
      { error: 'Only coaches can create workouts' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    // Add your workout creation logic here
    
    return NextResponse.json({
      success: true,
      message: 'Workout created by coach',
      workout: body,
      coach: user
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}