'use client';

import React from 'react';
import { Award, Compass, MapPin, Grid, Lock, Check } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  color: string;
}

export default function ProfilePage() {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Profile Header */}
      <div className="ios-card" style={{ alignItems: 'center', textAlign: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
          alt="Avatar"
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--ios-primary)' }}
        />
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginTop: '8px' }}>Мурад Мирзоев</h2>
        <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)' }}>
          📍 Владикавказ • В клубе с 2026
        </p>
        <p className="post-text" style={{ marginTop: '6px', fontSize: '14px' }}>
          Путешествую по горам Кавказа, ищу лучшие хинкали и делюсь секретными локациями.
        </p>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
            borderTop: '1px solid var(--ios-border)',
            paddingTop: '12px',
            marginTop: '8px',
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

              {/* Status Lock/Check Icon */}
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
    </div>
  );
}
