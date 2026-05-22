'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Award, Lock, Check, LogOut, ShieldAlert, LogIn } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  color: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const travelStats = {
    countries: 4,
    routes: 8,
    badges: 3,
  };

  const achievements: Badge[] = [
    {
      id: 1,
      name: 'Гурман',
      desc: 'Оставил отзывы на 5 ресторанов',
      icon: '🍖',
      unlocked: true,
      color: 'rgba(255, 149, 0, 0.1)',
    },
    {
      id: 2,
      name: 'Покоритель Кавказа',
      desc: 'Посетил 5 ключевых вершин региона',
      icon: '🏔️',
      unlocked: true,
      color: 'rgba(52, 199, 89, 0.1)',
    },
    {
      id: 3,
      name: 'Первооткрыватель',
      desc: 'Создал первый публичный маршрут',
      icon: '🗺️',
      unlocked: true,
      color: 'rgba(0, 122, 255, 0.1)',
    },
    {
      id: 4,
      name: 'Местный житель',
      desc: 'Опубликовал 3 секретных места (0/3)',
      icon: '🏡',
      unlocked: false,
      color: 'rgba(142, 142, 147, 0.1)',
    },
  ];

  if (status === 'loading') {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ios-text-secondary)' }}>Загрузка профиля...</div>;
  }

  // Enforce authentication / redirection
  if (status === 'unauthenticated' || !session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 0', maxWidth: '380px', margin: '0 auto', width: '100%' }}>
        <div className="ios-card" style={{ alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
          <ShieldAlert size={48} color="var(--ios-primary)" style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>Вы не авторизованы</h2>
          <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
            Войдите в свой аккаунт, чтобы сохранять маршруты, общаться с другими путешественниками и гидами.
          </p>
          
          <button
            onClick={() => router.push('/login')}
            style={{
              marginTop: '20px',
              width: '100%',
              background: 'var(--ios-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--ios-shadow-sm)',
            }}
          >
            <LogIn size={18} />
            <span>Войти в аккаунт</span>
          </button>
        </div>
      </div>
    );
  }

  const user = session.user as any;
  const isAdmin = user.role === 'Admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Profile Header */}
      <div className="ios-card" style={{ alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt="Avatar"
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--ios-primary)' }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '8px',
              backgroundColor: isAdmin ? 'var(--ios-red)' : 'var(--ios-primary)',
              color: '#fff',
              boxShadow: 'var(--ios-shadow-sm)',
            }}
          >
            {user.role === 'Admin' ? 'Создатель' : user.role === 'Guide' ? 'Гид' : 'Участник'}
          </span>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 700, marginTop: '12px' }}>{user.name}</h2>
        <p style={{ fontSize: '12px', color: 'var(--ios-text-secondary)', marginTop: '2px' }}>{user.email}</p>
        
        <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)', marginTop: '8px' }}>
          📍 Владикавказ • В клубе с 2026
        </p>

        {/* Admin Panel Access Button */}
        {isAdmin && (
          <button
            onClick={() => router.push('/admin')}
            style={{
              marginTop: '14px',
              width: '100%',
              background: 'var(--ios-red)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--ios-shadow-sm)',
              transition: 'opacity 0.2s',
            }}
          >
            ⚙️ Открыть панель администратора
          </button>
        )}

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
            borderTop: '1px solid var(--ios-border)',
            paddingTop: '12px',
            marginTop: '14px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>{travelStats.countries}</span>
            <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>Страны</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>{travelStats.routes}</span>
            <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>Маршруты</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>{travelStats.badges}</span>
            <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>Награды</span>
          </div>
        </div>
      </div>

      {/* Achievements / Badges Section */}
      <div className="ios-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--ios-border)', paddingBottom: '8px', marginBottom: '8px' }}>
          <Award size={18} color="var(--ios-primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Достижения и бейджи (Фишка №6)</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {achievements.map((a) => (
            <div
              key={a.id}
              style={{
                background: a.color,
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                opacity: a.unlocked ? 1 : 0.6,
                border: '1px solid var(--ios-border)',
              }}
            >
              <span style={{ fontSize: '28px', marginBottom: '4px' }}>{a.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ios-text)' }}>{a.name}</span>
              <span style={{ fontSize: '10px', color: 'var(--ios-text-secondary)', marginTop: '2px' }}>{a.desc}</span>

              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  color: a.unlocked ? 'var(--ios-green)' : 'var(--ios-text-secondary)',
                }}
              >
                {a.unlocked ? <Check size={14} /> : <Lock size={12} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{
          background: 'var(--ios-surface)',
          color: 'var(--ios-red)',
          border: '1px solid var(--ios-border)',
          borderRadius: '12px',
          padding: '12px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: 'var(--ios-shadow-sm)',
          transition: 'background-color 0.2s',
          marginBottom: '20px',
        }}
      >
        <LogOut size={16} />
        <span>Выйти из аккаунта</span>
      </button>

    </div>
  );
}
