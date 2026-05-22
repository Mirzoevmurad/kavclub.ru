'use client';

import React, { useState } from 'react';
import { Map, MapPin, Plus, Check } from 'lucide-react';

interface Country {
  id: number;
  name: string;
  flag: string;
  status: 'visited' | 'wishlist' | 'none';
}

export default function WishlistPage() {
  const [countries, setCountries] = useState<Country[]>([
    { id: 1, name: 'Россия', flag: '🇷🇺', status: 'visited' },
    { id: 2, name: 'Грузия', flag: '🇬🇪', status: 'visited' },
    { id: 3, name: 'Армения', flag: '🇦🇲', status: 'wishlist' },
    { id: 4, name: 'Турция', flag: '🇹🇷', status: 'visited' },
    { id: 5, name: 'Азербайджан', flag: '🇦🇿', status: 'wishlist' },
    { id: 6, name: 'Италия', flag: '🇮🇹', status: 'wishlist' },
  ]);

  const toggleStatus = (id: number) => {
    setCountries(
      countries.map((c) => {
        if (c.id === id) {
          const nextStatus =
            c.status === 'none'
              ? 'visited'
              : c.status === 'visited'
              ? 'wishlist'
              : 'none';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const visitedCount = countries.filter((c) => c.status === 'visited').length;
  const wishlistCount = countries.filter((c) => c.status === 'wishlist').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Map Stats */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <div className="ios-card" style={{ flex: 1, alignItems: 'center', textAlign: 'center', padding: '12px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ios-green)' }}>{visitedCount}</span>
          <span style={{ fontSize: '12px', color: 'var(--ios-text-secondary)', fontWeight: 600 }}>Где побывал</span>
        </div>
        <div className="ios-card" style={{ flex: 1, alignItems: 'center', textAlign: 'center', padding: '12px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ios-orange)' }}>{wishlistCount}</span>
          <span style={{ fontSize: '12px', color: 'var(--ios-text-secondary)', fontWeight: 600 }}>Хочу посетить</span>
        </div>
      </div>

      {/* Visual Map Canvas Placeholder */}
      <div className="ios-card" style={{ padding: '0', overflow: 'hidden', height: '220px', position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
          alt="Map"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '16px',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Map size={20} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Карта Кавказа и Мира</h3>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Тапайте по странам в списке ниже для отметки</p>
            </div>
          </div>
        </div>
      </div>

      {/* Country List */}
      <div className="ios-card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--ios-border)', paddingBottom: '8px' }}>
          Список стран
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {countries.map((c) => (
            <div
              key={c.id}
              onClick={() => toggleStatus(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--ios-border)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{c.flag}</span>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{c.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {c.status === 'visited' && (
                  <span className="ios-badge green">Побывал</span>
                )}
                {c.status === 'wishlist' && (
                  <span className="ios-badge orange">Хочу посетить</span>
                )}
                {c.status === 'none' && (
                  <span style={{ fontSize: '12px', color: 'var(--ios-text-secondary)' }}>Не отмечено</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
