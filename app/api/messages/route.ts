
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get messages where user is sender OR receiver
    try {
        const { data: messages, error: supabaseError } = await supabase
            .from('messages')
            .select(`
                id,
                content,
                created_at,
                is_read,
                sender_id,
                receiver_id
            `)
            .or(`sender_id.eq.${user.userId},receiver_id.eq.${user.userId}`)
            .order('created_at', { ascending: false })
            .limit(20);

        if (supabaseError) {
            throw supabaseError;
        }

        // Fetch user details for senders and receivers
        const userIds = new Set<string>();
        messages?.forEach(msg => {
            userIds.add(msg.sender_id);
            userIds.add(msg.receiver_id);
        });

        let userMap: { [key: string]: { name: string } } = {};
        if (userIds.size > 0) {
            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('id, name')
                .in('id', Array.from(userIds));

            if (usersError) {
                throw usersError;
            }

            userMap = (users || []).reduce((map, u) => {
                map[u.id] = { name: u.name };
                return map;
            }, {});
        }

        const formattedMessages = messages?.map(msg => ({
            id: msg.id,
            content: msg.content,
            created_at: msg.created_at,
            is_read: msg.is_read,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            sender_name: userMap[msg.sender_id]?.name || 'Unknown',
            receiver_name: userMap[msg.receiver_id]?.name || 'Unknown'
        })) || [];

        return NextResponse.json({
            success: true,
            messages: formattedMessages
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

        const { error: insertError } = await supabase
            .from('messages')
            .insert([{
                sender_id: user.userId,
                receiver_id: receiverId,
                content
            }]);

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
