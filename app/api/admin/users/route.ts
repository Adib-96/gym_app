import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase-server';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await authenticateRequest(request);

        if (error || !user) {
            return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const roleFilter = searchParams.get('role') || '';

        let query = supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .order('created_at', { ascending: false });

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        if (roleFilter) {
            query = query.eq('role', roleFilter);
        }

        const { data: usersData, error: supabaseError } = await query;

        if (supabaseError) {
            throw supabaseError;
        }

        return NextResponse.json({
            success: true,
            users: usersData || []
        });

    } catch (error) {
        console.error('❌ Admin Users Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { user, error } = await authenticateRequest(request);

        if (error || !user) {
            return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({
            success: true,
            message: 'User role updated successfully'
        });

    } catch (error) {
        console.error('❌ Admin User Update Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
