import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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
        const role = searchParams.get('role') || '';

        let queryText = 'SELECT id, name, email, role, created_at FROM users WHERE 1=1';
        const params: string[] = [];

        if (search) {
            params.push(`%${search}%`);
            queryText += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
        }

        if (role) {
            params.push(role);
            queryText += ` AND role = $${params.length}`;
        }

        queryText += ' ORDER BY created_at DESC';

        const usersResult = await query(queryText, params);

        return NextResponse.json({
            success: true,
            users: usersResult.rows
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

        await query(
            'UPDATE users SET role = $1 WHERE id = $2',
            [role, userId]
        );

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
