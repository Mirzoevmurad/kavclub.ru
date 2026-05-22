'use client';

import React from 'react';
import { Compass } from 'lucide-react';

interface NavBarProps {
  title?: string;
}

export default function NavBar({ title = 'KavClub' }: NavBarProps) {
  return (
    <header className="ios-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={22} color="var(--ios-primary)" />
        <h1 style={{ color: 'var(--ios-text)' }}>{title}</h1>
      </div>
      <button className="ios-navbar-btn">
        <span>RU</span>
      </button>
    </header>
  );
}
