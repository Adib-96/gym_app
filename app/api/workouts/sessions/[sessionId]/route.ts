import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { logExercise, completeWorkoutSession } from "@/lib/workout-logging-service";

// Log exercise performance or complete the session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Check if this is a completion request
    if (body.complete === true) {
      const { durationMinutes, notes } = body;
      const session = await completeWorkoutSession(sessionId, durationMinutes, notes);
      return NextResponse.json({
        success: true,
        data: session,
        message: 'Workout completed!',
      });
    }

    // Otherwise, log an exercise
    const {
      workoutExerciseId,
      setsCompleted,
      repsCompleted,
      weightUsed,
      rpe,
      notes,
    } = body;

    if (!workoutExerciseId || !setsCompleted || !repsCompleted) {
      return NextResponse.json(
        { error: 'workoutExerciseId, setsCompleted, and repsCompleted are required' },
        { status: 400 }
      );
    }

    const log = await logExercise(
      sessionId,
      workoutExerciseId,
      setsCompleted,
      repsCompleted,
      weightUsed,
      rpe,
      notes
    );

    return NextResponse.json({
      success: true,
      data: log,
      message: 'Exercise logged successfully!',
    });
  } catch (error) {
    console.error('Error logging exercise:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
