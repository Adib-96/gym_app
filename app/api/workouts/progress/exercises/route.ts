import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getLoggedExercises } from "@/lib/workout-logging-service";

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await authenticateRequest(request);

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const exercises = await getLoggedExercises(user.userId);

        return NextResponse.json({
            success: true,
            data: exercises,
        });
    } catch (error) {
        console.error('Error fetching logged exercises:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
