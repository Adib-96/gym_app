// ./app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';
import logger from '@/logger'; // Winston logger

// Define types for Supabase rows
type Message = {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_id: string;
  receiver_id: string;
};

type User = {
  id: string;
  name: string;
};

type UserMap = Record<string, { name: string }>;

// GET: Fetch messages for the authenticated user
export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    logger.warn('Unauthorized GET request to /messages');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch last 20 messages where user is sender OR receiver
    const { data: messages, error: supabaseError } = await supabase
      .from('messages')
      .select('id, content, created_at, is_read, sender_id, receiver_id')
      .or(`sender_id.eq.${user.userId},receiver_id.eq.${user.userId}`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (supabaseError) throw supabaseError;

    // Collect unique user IDs for sender/receiver
    const userIds = new Set<string>();
    messages?.forEach((msg) => {
      userIds.add(msg.sender_id);
      userIds.add(msg.receiver_id);
    });

    let userMap: UserMap = {};
    if (userIds.size > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name')
        .in('id', Array.from(userIds));

      if (usersError) throw usersError;

      // Build userMap with proper typing
      userMap = (users || []).reduce<UserMap>((map, u) => {
        map[u.id] = { name: u.name };
        return map;
      }, {});
    }

    const formattedMessages = messages?.map((msg) => ({
      id: msg.id,
      content: msg.content,
      created_at: msg.created_at,
      is_read: msg.is_read,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      sender_name: userMap[msg.sender_id]?.name || 'Unknown',
      receiver_name: userMap[msg.receiver_id]?.name || 'Unknown',
    })) || [];

    logger.info(`Fetched ${formattedMessages.length} messages for user ${user.userId}`);

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
    });
  } catch (err: any) {
    logger.error(`Error fetching messages: ${err.message}`);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Send a message
export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    logger.warn('Unauthorized POST request to /messages');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      logger.warn(`Missing fields in message POST by user ${user.userId}`);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error: insertError } = await supabase.from('messages').insert([
      {
        sender_id: user.userId,
        receiver_id: receiverId,
        content,
      },
    ]);

    if (insertError) throw insertError;

    logger.info(`User ${user.userId} sent a message to ${receiverId}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    logger.error(`Error sending message: ${err.message}`);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}