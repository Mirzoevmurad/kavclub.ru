'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Users, MessageSquare, Shield, Milestone, UserCheck } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  admins: number;
  guides: number;
  moderators: number;
  travelers: number;
  totalMessages: number;
}

export default function AdminPanelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole !== 'Admin') {
        setError('Доступ запрещен: страница доступна только создателю и администраторам');
        setLoading(false);
        return;
      }

      fetchData();
    }
  }, [status, session]);

  async function fetchData() {
    try {
      setError(null);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Ошибка загрузки данных');
      }
      const data = await response.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Произошла непредвиденная ошибка');
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Не удалось обновить роль');
        return;
      }

      // Refresh data
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Ошибка при изменении роли');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    u.name.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ios-text-secondary)' }}>Загрузка панели администратора...</div>;
  }

  if (error) {
    return (
      <div className="ios-card" style={{ alignItems: 'center', textAlign: 'center', padding: '40px 20px', marginTop: '20px' }}>
        <ShieldAlert size={48} color="var(--ios-red)" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Ограничение доступа</h3>
        <p style={{ fontSize: '14px', color: 'var(--ios-text-secondary)', marginTop: '8px' }}>{error}</p>
        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '16px',
            background: 'var(--ios-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={24} color="var(--ios-primary)" />
        <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>Панель управления KavClub</h2>
      </div>

      {/* Stats Cards Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="ios-card" style={{ padding: '14px', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ios-primary)' }}>
              <Users size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Всего участников</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.totalUsers}</span>
          </div>

          <div className="ios-card" style={{ padding: '14px', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ios-orange)' }}>
              <Milestone size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Локальные Гиды</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.guides}</span>
          </div>

          <div className="ios-card" style={{ padding: '14px', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ios-green)' }}>
              <MessageSquare size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Сообщений отправлено</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.totalMessages}</span>
          </div>

          <div className="ios-card" style={{ padding: '14px', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ios-red)' }}>
              <UserCheck size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Администраторы</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.admins}</span>
          </div>
        </div>
      )}

      {/* Users Management Section */}
      <div className="ios-card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Управление пользователями и ролями</h3>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Поиск по имени или email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid var(--ios-border)',
            fontSize: '14px',
            background: 'var(--ios-background)',
            color: 'var(--ios-text)',
            outline: 'none',
            marginBottom: '12px',
          }}
        />

        {/* Users List Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--ios-border)',
                background: 'var(--ios-background)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{user.name || 'Без имени'}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--ios-text-secondary)' }}>{user.email}</span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    backgroundColor:
                      user.role === 'Admin'
                        ? 'rgba(255, 59, 48, 0.1)'
                        : user.role === 'Guide'
                        ? 'rgba(255, 149, 0, 0.1)'
                        : user.role === 'Moderator'
                        ? 'rgba(0, 122, 255, 0.1)'
                        : 'rgba(142, 142, 147, 0.1)',
                    color:
                      user.role === 'Admin'
                        ? 'var(--ios-red)'
                        : user.role === 'Guide'
                        ? 'var(--ios-orange)'
                        : user.role === 'Moderator'
                        ? 'var(--ios-primary)'
                        : 'var(--ios-text-secondary)',
                  }}
                >
                  {user.role}
                </span>
              </div>

              {/* Action Button/Dropdown to Change Role */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ios-border)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>
                  Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}
                </span>
                <select
                  value={user.role}
                  disabled={session?.user?.email === user.email} // Creator cannot accidentally demote themselves
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--ios-border)',
                    fontSize: '12px',
                    background: 'var(--ios-surface)',
                    color: 'var(--ios-text)',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                >
                  <option value="Traveler">Traveler (Путешественник)</option>
                  <option value="Guide">Guide (Локальный гид)</option>
                  <option value="Moderator">Moderator (Модератор)</option>
                  <option value="Admin">Admin (Администратор)</option>
                </select>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--ios-text-secondary)', fontSize: '13px' }}>
              Пользователи не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
