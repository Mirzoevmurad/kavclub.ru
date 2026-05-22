import React from 'react';
import Link from 'next/link';
import { Compass, MessageSquare } from 'lucide-react';

interface NavBarProps {
  title?: string;
}

export default function NavBar({ title = 'KavClub' }: NavBarProps) {
  return (
    <header className="ios-navbar">
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={22} color="var(--ios-primary)" />
        <h1 style={{ color: 'var(--ios-text)', fontSize: '17px', fontWeight: 600 }}>{title}</h1>
      </Link>
      <Link href="/chat" className="ios-navbar-btn" style={{ display: 'flex', alignItems: 'center' }}>
        <MessageSquare size={22} color="var(--ios-primary)" />
      </Link>
    </header>
  );
}
