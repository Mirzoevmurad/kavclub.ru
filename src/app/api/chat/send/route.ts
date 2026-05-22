import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { chatEmitter } from '@/lib/chat-events';
import { z } from 'zod';

const messageSchema = z.object({
  receiverId: z.string().min(1, 'Укажите получателя'),
  text: z.string().min(1, 'Сообщение не может быть пустым').max(1000, 'Длина сообщения не должна превышать 1000 символов'),
});

// Helper function to escape HTML tags and prevent basic XSS
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    // Validate inputs
    const parsedData = messageSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { receiverId, text } = parsedData.data;

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json({ message: 'Получатель не найден' }, { status: 404 });
    }

    // Save message to database with sanitized text
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        text: sanitizeHtml(text),
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Emit event for real-time delivery via SSE
    chatEmitter.emit('new-message', message);

    return NextResponse.json({ message: 'Сообщение отправлено', data: message }, { status: 201 });
  } catch (error) {
    console.error('Send Message Error:', error);
    return NextResponse.json({ message: 'Ошибка на сервере' }, { status: 500 });
  }
}
