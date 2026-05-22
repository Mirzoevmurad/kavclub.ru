import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'Admin') {
      return NextResponse.json({ message: 'Доступ запрещен (требуются права администратора)' }, { status: 403 });
    }

    // Retrieve all users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Aggregate statistics
    const stats = {
      totalUsers: users.length,
      admins: users.filter((u: any) => u.role === 'Admin').length,
      guides: users.filter((u: any) => u.role === 'Guide').length,
      moderators: users.filter((u: any) => u.role === 'Moderator').length,
      travelers: users.filter((u: any) => u.role === 'Traveler').length,
      totalMessages: await prisma.message.count(),
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
