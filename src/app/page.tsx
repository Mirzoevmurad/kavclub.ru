'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Copy, MapPin, Star, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: number;
  author: string;
  avatar: string;
  role: string;
  badge: { text: string; color: string };
  time: string;
  text: string;
  image?: string;
  location?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  route?: string[];
  foodDetail?: {
    name: string;
    dish: string;
    price: string;
    rating: number;
  };
}

export default function FeedPage() {
  const [activeSegment, setActiveSegment] = useState<'popular' | 'my-routes'>('popular');
  const [copiedRoute, setCopiedRoute] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Александр Миронов',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Путешественник',
      badge: { text: 'Покоритель Кавказа', color: 'orange' },
      time: '2 часа назад',
      text: 'Прошел отличный однодневный маршрут по Тбилиси! Собрал для вас лучшие виды, уютные кофейни и скрытые улочки. Наслаждайтесь!',
      image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80',
      location: 'Тбилиси, Грузия',
      likes: 124,
      comments: 18,
      route: ['Серные бани', 'Каньон Легвтахеви', 'Кофейня Coffeesta', 'Крепость Нарикала', 'Мост Мира']
    },
    {
      id: 2,
      author: 'Мария Демидова',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Локальный Гид',
      badge: { text: 'Верифицирован', color: 'green' },
      time: '5 часов назад',
      text: '✨ Секретное место: Салтинский подземный водопад в Дагестане. Это единственная подземная река в Дагестане, которая падает сквозь пещерный купол. Лучшее время для посещения — полдень, когда лучи солнца пробивают расщелины!',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
      location: 'Салта, Дагестан',
      likes: 298,
      comments: 42
    },
    {
      id: 3,
      author: 'Руслан Тедеев',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Фуд-блогер',
      badge: { text: 'Гурман', color: 'blue' },
      time: 'Вчера',
      text: 'Вчера заглянул в чудесное место во Владикавказе. Обязательно попробуйте фирменные пироги с сыром и свекольной ботвой (олибах). Вкус невероятный!',
      location: 'Владикавказ, Осетия',
      likes: 85,
      comments: 7,
      foodDetail: {
        name: 'Ресторан «Премьер»',
        dish: 'Осетинский пирог Олибах',
        price: '450 ₽',
        rating: 4.9
      }
    }
  ]);

  const handleLike = (id: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          };
        }
        return post;
      })
    );
  };

  const handleCloneRoute = (routeName: string) => {
    setCopiedRoute(routeName);
    setTimeout(() => {
      setCopiedRoute(null);
    }, 2500);
  };

  return (
    <>
      {/* Toast Notification for Cloned Routes */}
      <AnimatePresence>
        {copiedRoute && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 12 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '54px',
              left: '0',
              right: '0',
              zIndex: 1100,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <div
              style={{
                background: 'rgba(52, 199, 89, 0.95)',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--ios-shadow-lg)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Маршрут «{copiedRoute}» сохранен в профиль!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segmented Control Feed Switch */}
      <div className="ios-segmented-control" style={{ marginBottom: '8px' }}>
        <button
          onClick={() => setActiveSegment('popular')}
          className={`ios-segment-btn ${activeSegment === 'popular' ? 'active' : ''}`}
        >
          Популярное
        </button>
        <button
          onClick={() => setActiveSegment('my-routes')}
          className={`ios-segment-btn ${activeSegment === 'my-routes' ? 'active' : ''}`}
        >
          Мои маршруты
        </button>
      </div>

      {/* Conditional Feed Content */}
      {activeSegment === 'popular' ? (
        posts.map((post) => (
          <article className="ios-card" key={post.id}>
            {/* Header */}
            <div className="post-header">
              <img src={post.avatar} alt={post.author} className="post-avatar" />
              <div className="post-author-info">
                <span className="post-author-name">{post.author}</span>
                <div className="post-author-meta">
                  <span>{post.time}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <MapPin size={12} color="var(--ios-primary)" />
                        <span>{post.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className={`ios-badge ${post.badge.color}`}>
                  {post.badge.text}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="post-text">{post.text}</p>

            {/* Food Card Detail (Feature 3 equivalent) */}
            {post.foodDetail && (
              <div
                style={{
                  background: 'var(--ios-background)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid var(--ios-border)'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(255, 149, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ios-orange)'
                  }}
                >
                  <UtensilsCrossed size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{post.foodDetail.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--ios-text-secondary)' }}>
                    Рекомендую: {post.foodDetail.dish} • {post.foodDetail.price}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--ios-orange)' }}>
                  <Star size={14} fill="var(--ios-orange)" />
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{post.foodDetail.rating}</span>
                </div>
              </div>
            )}

            {/* Image (if any) */}
            {post.image && (
              <div className="post-media-container">
                <img src={post.image} alt="Travel Media" className="post-media" />
              </div>
            )}

            {/* Route Points Detail (Feature 7 equivalent) */}
            {post.route && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ios-text-secondary)' }}>
                  Маршрут дня:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {post.route.map((point, index) => (
                    <React.Fragment key={point}>
                      <span
                        style={{
                          background: 'rgba(0, 122, 255, 0.08)',
                          color: 'var(--ios-primary)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        {point}
                      </span>
                      {index < post.route!.length - 1 && (
                        <span style={{ color: 'var(--ios-text-secondary)', fontSize: '11px' }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Clone Route Button */}
                <button
                  onClick={() => handleCloneRoute(post.location || 'Новый маршрут')}
                  style={{
                    marginTop: '8px',
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
                    boxShadow: 'var(--ios-shadow-sm)',
                    transition: 'opacity 0.2s'
                  }}
                  className="clone-route-btn"
                >
                  <Copy size={14} />
                  <span>Сохранить маршрут в мои поездки</span>
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="post-actions">
              <button
                onClick={() => handleLike(post.id)}
                className={`post-action-btn ${post.isLiked ? 'active-like' : ''}`}
              >
                <Heart fill={post.isLiked ? 'var(--ios-red)' : 'none'} />
                <span>{post.likes}</span>
              </button>
              <button className="post-action-btn">
                <MessageCircle />
                <span>{post.comments}</span>
              </button>
            </div>
          </article>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ios-text-secondary)' }}>
          <Compass size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3>Вы пока не создали ни одного маршрута</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>
            Нажмите кнопку «Сохранить маршрут» на чужом посте или создайте новый в вашем профиле.
          </p>
        </div>
      )}
    </>
  );
}
