
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const result = await query(
            `SELECT id, name, muscle_group, description 
       FROM exercises 
       ORDER BY name`
        );

        return NextResponse.json({
            success: true,
            exercises: result.rows
        });

    } catch (error) {
        console.error('Error fetching exercises:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exercises' },
            { status: 500 }
        );
    }
}
