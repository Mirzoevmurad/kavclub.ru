import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch all messages involving this user, ordered by newest first
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true, role: true },
        },
        receiver: {
          select: { id: true, name: true, image: true, role: true },
        },
      },
    });

    // Group messages by conversational partner
    const dialogMap = new Map();
    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!otherUser) continue; // Safety fallback
      
      if (!dialogMap.has(otherUser.id)) {
        dialogMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: {
            id: msg.id,
            text: msg.text,
            createdAt: msg.createdAt,
            senderId: msg.senderId,
          },
        });
      }
    }

    const dialogs = Array.from(dialogMap.values());

    return NextResponse.json({ dialogs });
  } catch (error) {
    console.error('Fetch Dialogs Error:', error);
    return NextResponse.json({ message: 'Ошибка на сервере' }, { status: 500 });
  }
}
