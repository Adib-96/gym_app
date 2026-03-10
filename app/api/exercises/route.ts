
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { data: exercises, error: supabaseError } = await supabase
            .from('exercises')
            .select('id, name, muscle_group, description')
            .order('name');

        if (supabaseError) {
            throw supabaseError;
        }

        return NextResponse.json({
            success: true,
            exercises: exercises || []
        });

    } catch (error) {
        console.error('Error fetching exercises:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exercises' },
            { status: 500 }
        );
    }
}
