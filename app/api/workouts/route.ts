import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getClientWorkouts, getClientStats } from "@/lib/workouts-service";

export async function GET(request: NextRequest) {
    try {
        // Authenticate the request to get current user
        const { user, error } = await authenticateRequest(request);
        
        if (error || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get workouts for the authenticated client
        const workouts = await getClientWorkouts(user.userId);
        const stats = await getClientStats(user.userId);

        return NextResponse.json({
            success: true,
            data: {
                workouts,
                stats,
                clientId: user.userId,
            }
        });
    } catch (error) {
        console.error('Workouts API error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
