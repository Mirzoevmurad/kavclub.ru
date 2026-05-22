'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Compass, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так');
      }

      setSuccess('Регистрация прошла успешно! Выполняется вход...');

      // Auto sign in user after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        router.push('/login');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка на сервере');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 0', maxWidth: '380px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'var(--ios-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--ios-shadow-md)',
          }}
        >
          <Compass size={32} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '12px' }}>Создать аккаунт</h2>
        <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)' }}>Присоединяйтесь к сообществу KavClub</p>
      </div>

      <div className="ios-card" style={{ gap: '16px', padding: '20px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {error && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: [0, -10, 10, -10, 10, 0], opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(255, 59, 48, 0.1)',
                color: 'var(--ios-red)',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 500,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <div
              style={{
                background: 'rgba(52, 199, 89, 0.1)',
                color: 'var(--ios-green)',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 500,
              }}
            >
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Name Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ios-text-secondary)' }}>Ваше имя</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--ios-text-secondary)' }} />
              <input
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--ios-border)',
                  fontSize: '14px',
                  background: 'var(--ios-background)',
                  color: 'var(--ios-text)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ios-text-secondary)' }}>Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--ios-text-secondary)' }} />
              <input
                type="email"
                placeholder="example@kavclub.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--ios-border)',
                  fontSize: '14px',
                  background: 'var(--ios-background)',
                  color: 'var(--ios-text)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ios-text-secondary)' }}>Пароль</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--ios-text-secondary)' }} />
              <input
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--ios-border)',
                  fontSize: '14px',
                  background: 'var(--ios-background)',
                  color: 'var(--ios-text)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--ios-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', fontSize: '13px' }}>
        <span style={{ color: 'var(--ios-text-secondary)' }}>Уже есть аккаунт? </span>
        <button
          onClick={() => router.push('/login')}
          style={{ background: 'none', border: 'none', color: 'var(--ios-primary)', fontWeight: 600, cursor: 'pointer' }}
        >
          Войти
        </button>
      </div>
    </div>
  );
}
