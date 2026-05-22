'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, ShieldCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

interface UserInfo {
  id: string;
  name: string;
  image: string;
  role: string;
}

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.partnerId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<UserInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock users if database fails or during initial transition
  const mockPartners: Record<string, UserInfo> = {
    'usr-alex': { id: 'usr-alex', name: 'Александр Миронов', role: 'Путешественник', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    'usr-maria': { id: 'usr-maria', name: 'Мария Демидова', role: 'Локальный Гид', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    'usr-ruslan': { id: 'usr-ruslan', name: 'Руслан Тедеев', role: 'Фуд-блогер', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  };

  // Fetch session user and message history
  useEffect(() => {
    async function fetchSessionAndHistory() {
      try {
        // Fetch current session details
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData?.user) {
            setCurrentUserId(sessionData.user.id);
          } else {
            // Set a mock user ID for previewing chats if not logged in
            setCurrentUserId('usr-my-temp-id');
          }
        }

        // Fetch messages
        const historyResponse = await fetch(`/api/chat/history?otherUserId=${partnerId}`);
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setMessages(historyData.messages);
        } else {
          // If no database messages, set some mock greeting messages for demo
          setMessages([
            {
              id: 'msg-1',
              senderId: partnerId,
              receiverId: 'usr-my-temp-id',
              text: `Привет! Я ${mockPartners[partnerId]?.name || 'твой собеседник'}. Увидел твою активность в клубе. Чем могу помочь?`,
              createdAt: new Date(Date.now() - 600000).toISOString(),
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching chat details:', err);
      } finally {
        setLoading(false);
      }
    }

    setPartner(mockPartners[partnerId] || { id: partnerId, name: 'Собеседник', role: 'Пользователь', image: '' });
    fetchSessionAndHistory();
  }, [partnerId]);

  // Connect to SSE stream for real-time messages
  useEffect(() => {
    const eventSource = new EventSource('/api/chat/stream');

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        // Add message if it matches this specific conversation
        if (
          (message.senderId === partnerId && message.receiverId === currentUserId) ||
          (message.senderId === currentUserId && message.receiverId === partnerId)
        ) {
          setMessages((prev) => {
            // Avoid adding duplicates
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      } catch (err) {
        console.error('Error parsing SSE event data:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [partnerId, currentUserId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText;
    setInputText('');

    // Append message optimistically to the UI
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      senderId: currentUserId || 'usr-my-temp-id',
      receiverId: partnerId,
      text: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: partnerId,
          text: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }

      const data = await response.json();
      // Replace optimistic message with the actual database message
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? data.data : m))
      );
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', position: 'relative' }}>
      
      {/* Active Conversation Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--ios-border)',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={() => router.push('/chat')}
          style={{ background: 'none', border: 'none', color: 'var(--ios-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        {partner && (
          <>
            <img
              src={partner.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={partner.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>{partner.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--ios-text-secondary)' }}>{partner.role}</span>
            </div>
          </>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--ios-green)', fontSize: '11px', fontWeight: 600 }}>
          <ShieldCheck size={14} />
          <span>SSL Защита</span>
        </div>
      </div>

      {/* Message Bubbles Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '4px',
          paddingBottom: '16px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--ios-text-secondary)' }}>
            Загрузка переписки...
          </div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '8px 14px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    background: isMyMessage ? 'var(--ios-primary)' : 'var(--ios-border)',
                    color: isMyMessage ? '#fff' : 'var(--ios-text)',
                    borderBottomRightRadius: isMyMessage ? '4px' : '16px',
                    borderBottomLeftRadius: isMyMessage ? '16px' : '4px',
                    boxShadow: 'var(--ios-shadow-sm)',
                    wordBreak: 'break-word',
                  }}
                >
                  <p>{msg.text}</p>
                  <span
                    style={{
                      fontSize: '9px',
                      color: isMyMessage ? 'rgba(255,255,255,0.7)' : 'var(--ios-text-secondary)',
                      display: 'block',
                      textAlign: 'right',
                      marginTop: '4px',
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message Input Footer */}
      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 0',
          borderTop: '1px solid var(--ios-border)',
          background: 'var(--ios-surface)',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <input
          type="text"
          placeholder="Cообщение..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          required
          maxLength={1000}
          style={{
            flex: 1,
            border: '1px solid var(--ios-border)',
            borderRadius: '20px',
            padding: '10px 16px',
            fontSize: '14px',
            background: 'var(--ios-background)',
            color: 'var(--ios-text)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--ios-primary)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
}
