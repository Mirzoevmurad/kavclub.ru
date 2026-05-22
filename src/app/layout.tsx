import './globals.css';
import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TabBar from '@/components/TabBar';

export const metadata: Metadata = {
  title: 'KavClub — Социальная сеть для путешественников',
  description: 'Поделись своими маршрутами, находи попутчиков и локальных гидов',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="app-container">
          <NavBar />
          <main className="ios-content">
            {children}
          </main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
