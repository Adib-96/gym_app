import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { startWorkoutSession, getSessionExerciseLogs } from "@/lib/workout-logging-service";

// Start a new workout session
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workoutId, notes } = await request.json();

    if (!workoutId) {
      return NextResponse.json({ error: 'workoutId is required' }, { status: 400 });
    }

    const session = await startWorkoutSession(user.userId, workoutId, notes);

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error starting workout session:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Get all sessions or a specific session
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = request.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId parameter required' }, { status: 400 });
    }

    const exercises = await getSessionExerciseLogs(sessionId);

    return NextResponse.json({
      success: true,
      data: exercises,
    });
  } catch (error) {
    console.error('Error fetching session details:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
