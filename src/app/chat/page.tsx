'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, ChevronRight, User } from 'lucide-react';

interface Dialog {
  user: {
    id: string;
    name: string;
    image: string;
    role: string;
  };
  lastMessage: {
    text: string;
    createdAt: string;
    senderId: string;
  };
}

export default function ChatListPage() {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Mock list of recommended people (guides and travelers from feed) to start a chat with
  const recommendedUsers = [
    { id: 'usr-alex', name: 'Александр Миронов', role: 'Путешественник', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: 'usr-maria', name: 'Мария Демидова', role: 'Локальный Гид', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { id: 'usr-ruslan', name: 'Руслан Тедеев', role: 'Фуд-блогер', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  ];

  useEffect(() => {
    async function fetchDialogs() {
      try {
        const response = await fetch('/api/chat/dialogs');
        if (response.ok) {
          const data = await response.json();
          setDialogs(data.dialogs);
        }
      } catch (err) {
        console.error('Error fetching dialogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDialogs();
  }, []);

  const filteredDialogs = dialogs.filter((d) =>
    d.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search Field */}
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
          placeholder="Поиск диалогов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ios-text-secondary)' }}>
          Загрузка диалогов...
        </div>
      ) : filteredDialogs.length > 0 ? (
        <div className="ios-card" style={{ padding: '4px 0' }}>
          {filteredDialogs.map((dialog) => (
            <div
              key={dialog.user.id}
              onClick={() => router.push(`/chat/${dialog.user.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--ios-border)',
                cursor: 'pointer',
              }}
            >
              <img
                src={dialog.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={dialog.user.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>{dialog.user.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>
                    {new Date(dialog.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--ios-text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '300px',
                  }}
                >
                  {dialog.lastMessage.text}
                </p>
              </div>
              <ChevronRight size={16} color="var(--ios-text-secondary)" />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Empty State */}
          <div className="ios-card" style={{ alignItems: 'center', textAlign: 'center', padding: '30px 20px' }}>
            <MessageSquare size={48} style={{ opacity: 0.4, marginBottom: '12px', color: 'var(--ios-primary)' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Нет активных переписок</h4>
            <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)', marginTop: '4px' }}>
              Выберите собеседника из списка ниже, чтобы начать чат.
            </p>
          </div>

          {/* Recommended Users */}
          <div className="ios-card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ios-text-secondary)', marginBottom: '8px' }}>
              Начать новый чат:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {recommendedUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => router.push(`/chat/${user.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--ios-border)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>{user.role}</span>
                  </div>
                  <ChevronRight size={14} color="var(--ios-text-secondary)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
