import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  getUnreadCount,
} from "@/lib/notification-service";
import { sendNotificationToUser } from "@/lib/socket-io-server";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const action = request.nextUrl.searchParams.get("action");

    if (action === "unread-count") {
      const count = getUnreadCount(user.userId);
      return NextResponse.json({ unreadCount: count });
    }

    // Get all notifications for user
    const notifications = getUserNotifications(user.userId);
    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount: getUnreadCount(user.userId),
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId, type, title, message, data, actionUrl } = body;

    // Create notification
    const notification = createNotification(
      targetUserId,
      type,
      title,
      message,
      data,
      actionUrl
    );

    // Send real-time notification via Socket.io
    sendNotificationToUser(targetUserId, notification);

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId } = body;

    const success = markAsRead(user.userId, notificationId);

    return NextResponse.json({
      success,
      unreadCount: getUnreadCount(user.userId),
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
