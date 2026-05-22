import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const changeRoleSchema = z.object({
  userId: z.string().min(1, 'Укажите ID пользователя'),
  role: z.enum(['Traveler', 'Guide', 'Moderator', 'Admin']),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'Admin') {
      return NextResponse.json({ message: 'Доступ запрещен (требуются права администратора)' }, { status: 403 });
    }

    const body = await req.json();

    // Validate inputs
    const parsedData = changeRoleSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const { userId, role } = parsedData.data;

    // Check if target user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: `Роль пользователя ${updatedUser.name} изменена на ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Change Role Error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
