import './globals.css';
import type { Metadata, Viewport } from 'next';
import NavBar from '@/components/NavBar';
import TabBar from '@/components/TabBar';
import NextAuthSessionProvider from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'KavClub — Социальная сеть для путешественников',
  description: 'Поделись своими маршрутами, находи попутчиков и локальных гидов',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <NextAuthSessionProvider>
          <div className="app-container">
            <NavBar />
            <main className="ios-content">
              {children}
            </main>
            <TabBar />
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
