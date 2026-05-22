'use client';

import React from 'react';
import { Star, CheckCircle, Search, Calendar } from 'lucide-react';

interface Guide {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  location: string;
  languages: string;
  bio: string;
  tour: string;
  price: string;
}

export default function GuidesPage() {
  const guides: Guide[] = [
    {
      id: 1,
      name: 'Георгий Ванеев',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      rating: 4.9,
      reviewsCount: 38,
      location: 'Кавказские Минеральные Воды',
      languages: 'Русский, Английский',
      bio: 'Историк и профессиональный гид по Кавказу. Покажу вам скрытые ущелья, древние храмы и лучшие смотровые площадки Эльбруса.',
      tour: 'Авторский тур: Джип-тур на плато Бермамыт и водопады',
      price: '5 000 ₽ / день',
    },
    {
      id: 2,
      name: 'Нино Квирикашвили',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5.0,
      reviewsCount: 52,
      location: 'Тбилиси / Казбеги',
      languages: 'Грузинский, Русский, Английский',
      bio: 'Привет! Я влюблена в горы Грузии и местное виноделие. Провожу душевные пешие прогулки по старому Тбилиси и выезды в винную Кахетию.',
      tour: 'Пешеходная прогулка: Тайны старого Тбилиси с дегустацией',
      price: '3 500 ₽ / экскурсия',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--ios-border)',
          borderRadius: '10px',
          padding: '8px 12px',
          gap: '8px',
        }}
      >
        <Search size={16} color="var(--ios-text-secondary)" />
        <input
          type="text"
          placeholder="Поиск гида по городу или языку..."
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: 'var(--ios-text)',
            width: '100%',
          }}
        />
      </div>

      {/* Guides List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {guides.map((g) => (
          <div key={g.id} className="ios-card">
            {/* Guide Header */}
            <div className="post-header">
              <img src={g.avatar} alt={g.name} className="post-avatar" />
              <div className="post-author-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="post-author-name">{g.name}</span>
                  <CheckCircle size={14} color="var(--ios-green)" fill="rgba(48, 209, 88, 0.1)" />
                </div>
                <span className="post-author-meta">{g.location}</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--ios-orange)' }}>
                <Star size={14} fill="var(--ios-orange)" />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{g.rating}</span>
                <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>({g.reviewsCount})</span>
              </div>
            </div>

            {/* Guide Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
              <span style={{ color: 'var(--ios-text-secondary)' }}>
                🗣️ Языки: <strong style={{ color: 'var(--ios-text)' }}>{g.languages}</strong>
              </span>
              <p className="post-text" style={{ fontSize: '14px', marginTop: '6px' }}>
                {g.bio}
              </p>
            </div>

            {/* Author Tour */}
            <div
              style={{
                background: 'var(--ios-background)',
                borderRadius: '10px',
                padding: '10px',
                border: '1px solid var(--ios-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ios-primary)', textTransform: 'uppercase' }}>
                Популярная экскурсия
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{g.tour}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ios-text)', marginTop: '4px' }}>
                Стоимость: {g.price}
              </span>
            </div>

            {/* Book Button */}
            <button
              onClick={() => alert(`Связаться с гидом ${g.name}`)}
              style={{
                width: '100%',
                background: 'var(--ios-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'opacity 0.2s',
              }}
            >
              <Calendar size={14} />
              <span>Забронировать тур</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
