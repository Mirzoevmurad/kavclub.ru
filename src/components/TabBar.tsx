'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Newspaper, Map, Users, Milestone, User } from 'lucide-react';

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: 'Лента', icon: Newspaper, path: '/' },
    { name: 'Моя Карта', icon: Map, path: '/wishlist' },
    { name: 'Встречи', icon: Users, path: '/meetups' },
    { name: 'Гиды', icon: Milestone, path: '/guides' },
    { name: 'Профиль', icon: User, path: '/profile' }
  ];

  return (
    <nav className="ios-tabbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.path;

        return (
          <button
            key={tab.path}
            onClick={() => router.push(tab.path)}
            className={`ios-tab-item ${isActive ? 'active' : ''}`}
          >
            <Icon />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
