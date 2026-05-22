'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Compass, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
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
        <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '12px' }}>Вход в KavClub</h2>
        <p style={{ fontSize: '13px', color: 'var(--ios-text-secondary)' }}>Сообщество путешественников Кавказа</p>
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
                placeholder="••••••"
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
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', fontSize: '13px' }}>
        <span style={{ color: 'var(--ios-text-secondary)' }}>Еще нет аккаунта? </span>
        <button
          onClick={() => router.push('/register')}
          style={{ background: 'none', border: 'none', color: 'var(--ios-primary)', fontWeight: 600, cursor: 'pointer' }}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
