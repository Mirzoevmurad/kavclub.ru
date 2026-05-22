'use client';

import React, { useState } from 'react';
import { Users, Clock, Send, PlusCircle } from 'lucide-react';

interface Meetup {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timeLeft: string;
  location: string;
}

export default function MeetupsPage() {
  const [meetups, setMeetups] = useState<Meetup[]>([
    {
      id: 1,
      user: 'Даниил Котов',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      text: 'Ищу компанию поужинать осетинскими пирогами сегодня в 19:30 во Владикавказе. С меня интересные истории из похода!',
      timeLeft: 'осталось 4 часа',
      location: 'Владикавказ',
    },
    {
      id: 2,
      user: 'Алена Смирнова',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      text: 'Собираюсь завтра на рассвете поехать в Казбеги. Ищу попутчика в такси, чтобы разделить стоимость поездки. Выезжаем из Тбилиси.',
      timeLeft: 'осталось 12 часов',
      location: 'Тбилиси',
    },
  ]);

  const [newText, setNewText] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newMeetup: Meetup = {
      id: Date.now(),
      user: 'Вы (Тестовый аккаунт)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      text: newText,
      timeLeft: 'осталось 24 часа',
      location: newLoc || 'Везде',
    };

    setMeetups([newMeetup, ...meetups]);
    setNewText('');
    setNewLoc('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Quick Info */}
      <div className="ios-badge orange" style={{ alignSelf: 'center' }}>
        <Clock size={12} style={{ marginRight: '4px' }} />
        Все объявления исчезают через 24 часа автоматически
      </div>

      {/* New Post Form */}
      <form onSubmit={handlePost} className="ios-card">
        <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Новое объявление</h3>
        <textarea
          placeholder="Куда вы идете и кого ищете? Напишите детали..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          required
          style={{
            width: '100%',
            height: '80px',
            border: '1px solid var(--ios-border)',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '14px',
            resize: 'none',
            background: 'var(--ios-background)',
            color: 'var(--ios-text)',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Город/Локация"
            value={newLoc}
            onChange={(e) => setNewLoc(e.target.value)}
            style={{
              flex: 1,
              border: '1px solid var(--ios-border)',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '13px',
              background: 'var(--ios-background)',
              color: 'var(--ios-text)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--ios-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <PlusCircle size={16} />
            <span>Создать</span>
          </button>
        </div>
      </form>

      {/* Active Meetups List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {meetups.map((m) => (
          <div key={m.id} className="ios-card">
            <div className="post-header">
              <img src={m.avatar} alt={m.user} className="post-avatar" />
              <div className="post-author-info">
                <span className="post-author-name">{m.user}</span>
                <span className="post-author-meta">{m.location}</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--ios-text-secondary)', fontSize: '12px' }}>
                <Clock size={12} />
                <span>{m.timeLeft}</span>
              </div>
            </div>
            <p className="post-text">{m.text}</p>
            <button
              onClick={() => alert(`Открыть чат с ${m.user}`)}
              style={{
                width: '100%',
                background: 'var(--ios-border)',
                color: 'var(--ios-primary)',
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
              <Send size={14} />
              <span>Написать автору</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
