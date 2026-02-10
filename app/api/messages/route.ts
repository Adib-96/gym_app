
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get messages where user is sender OR receiver
    // We might want to filter by "conversation" with a specific other user, but for now typical dashboard shows "Recent Messages"
    // Let's return the last 20 messages involving this user.
    try {
        const res = await query(
            `SELECT 
        m.id, 
        m.content, 
        m.created_at, 
        m.is_read,
        sender.name as sender_name,
        receiver.name as receiver_name,
        m.sender_id,
        m.receiver_id
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY m.created_at DESC
       LIMIT 20`,
            [user.userId]
        );

        return NextResponse.json({
            success: true,
            messages: res.rows
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { receiverId, content } = body;

        if (!receiverId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await query(
            `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`,
            [user.userId, receiverId, content]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
