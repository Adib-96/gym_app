import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getProgressData, getClientStreakStats } from "@/lib/workout-logging-service";

// Get progress data for charts
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exerciseId = request.nextUrl.searchParams.get('exerciseId') || undefined;
    const days = parseInt(request.nextUrl.searchParams.get('days') || '30');

    const [progressData, streakStats] = await Promise.all([
      getProgressData(user.userId, exerciseId, days),
      getClientStreakStats(user.userId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        progressData,
        streakStats,
      },
    });
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
