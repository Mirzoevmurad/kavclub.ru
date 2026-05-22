import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { chatEmitter } from '@/lib/chat-events';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response('Не авторизован', { status: 401 });
    }

    const userId = (session.user as any).id;

    const responseStream = new ReadableStream({
      start(controller) {
        // Event listener for new messages
        const onMessage = (message: any) => {
          // Direct message to current client only if they are sender or receiver
          if (message.senderId === userId || message.receiverId === userId) {
            try {
              controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
            } catch (err) {
              console.error('Error writing to SSE stream:', err);
            }
          }
        };

        chatEmitter.on('new-message', onMessage);

        // Send a keep-alive comment every 15 seconds to prevent gateway (e.g. Nginx, Cloudflare) timeouts
        const keepAliveInterval = setInterval(() => {
          try {
            controller.enqueue(': keepalive\n\n');
          } catch (err) {
            console.error('Error writing keepalive to stream:', err);
          }
        }, 15000);

        // Listen for client disconnection to cleanup listeners and prevent memory leaks
        req.signal.addEventListener('abort', () => {
          chatEmitter.off('new-message', onMessage);
          clearInterval(keepAliveInterval);
          try {
            controller.close();
          } catch (err) {
            // Already closed
          }
        });
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('SSE Stream Error:', error);
    return new Response('Ошибка сервера', { status: 500 });
  }
}
