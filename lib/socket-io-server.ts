// Socket.io Server Initialization
import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export function initializeSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user to their personal room for notifications and messages
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Leave user room
    socket.on('leave', (userId: string) => {
      socket.leave(`user:${userId}`);
      console.log(`User ${userId} left their room`);
    });

    // Handle new message - broadcast to receiver
    socket.on('message:send', (data: { senderId: string; receiverId: string; content: string; senderName: string; timestamp: string }) => {
      console.log(`Message from ${data.senderId} to ${data.receiverId}: ${data.content}`);
      
      // Send to receiver's personal room
      socket.to(`user:${data.receiverId}`).emit('message:receive', {
        id: Date.now().toString(), // Temporary ID until saved to DB
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        content: data.content,
        sender_name: data.senderName,
        created_at: data.timestamp,
        is_read: false
      });

      // Also send back to sender for confirmation
      socket.emit('message:sent', {
        id: Date.now().toString(),
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        content: data.content,
        sender_name: data.senderName,
        created_at: data.timestamp,
        is_read: false
      });
    });

    // Mark notification as read
    socket.on('notification:read', (data: { userId: string; notificationId: string }) => {
      socket.to(`user:${data.userId}`).emit('notification:read', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocket(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

// Send notification to specific user (emit to their room)
export function sendNotificationToUser(userId: string, notification: any) {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification:new', notification);
}

// Send notification to multiple users
export function sendNotificationToUsers(userIds: string[], notification: any) {
  if (!io) return;
  userIds.forEach(userId => {
    io!.to(`user:${userId}`).emit('notification:new', notification);
  });
}

// Broadcast to all users (system-wide notification)
export function broadcastNotification(notification: any) {
  if (!io) return;
  io.emit('notification:broadcast', notification);
}
