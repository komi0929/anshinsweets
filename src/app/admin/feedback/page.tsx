'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import {
  getFeedbacks,
  createReply,
  CATEGORY_INFO,
  type Feedback,
  type FeedbackCategory,
} from '@/lib/feedback';

const ADMIN_PASSWORD = 'anshin2024';

export default function AdminFeedbackPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedbackCategory | 'all'>('all');
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    const data = await getFeedbacks(activeTab === 'all' ? undefined : activeTab);
    setFeedbacks(data);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    if (!authed) return;
    let ignore = false;
    (async () => {
      const data = await getFeedbacks(activeTab === 'all' ? undefined : activeTab);
      if (!ignore) {
        setFeedbacks(data);
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [authed, activeTab]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert('パスワードが違います');
    }
  };

  const handleReply = async (feedbackId: string) => {
    if (!replyMessage.trim()) return;
    setSending(true);
    const result = await createReply(feedbackId, replyMessage.trim(), true);
    if (result) {
      setReplyMessage('');
      setReplyTargetId(null);
      await loadFeedbacks();
    } else {
      alert('返信の送信に失敗しました');
    }
    setSending(false);
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
      }}>
        <div className="card" style={{ padding: 'var(--space-xl)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔒</div>
          <h1 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-lg)' }}>管理画面ログイン</h1>
          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <input
              className="input-field"
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button className="btn btn-primary btn-full" onClick={handleLogin}>
            ログイン
          </button>
          <Link href="/" style={{ display: 'block', marginTop: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            ← トップへ戻る
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { key: FeedbackCategory | 'all'; label: string; emoji: string; count: number }[] = [
    { key: 'all', label: 'すべて', emoji: '📋', count: feedbacks.length },
    ...(Object.entries(CATEGORY_INFO) as [FeedbackCategory, typeof CATEGORY_INFO.bug][]).map(([k, v]) => ({
      key: k,
      label: v.label,
      emoji: v.emoji,
      count: feedbacks.filter(f => f.category === k).length,
    })),
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh' }}>
      {/* Admin Header */}
      <nav style={{
        background: '#1E293B', color: 'white', padding: 'var(--space-md) var(--space-lg)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: '1.3rem' }}>🛡️</span>
          <h1 style={{ fontSize: '1rem', fontWeight: 700 }}>フィードバック管理</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Link href="/feedback" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            公開ページを見る →
          </Link>
          <button
            onClick={() => setAuthed(false)}
            style={{ background: 'transparent', border: '1px solid #475569', color: '#94A3B8', borderRadius: 8, padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            ログアウト
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-xl) var(--space-md)' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
                border: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                background: 'white', cursor: 'pointer', textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>{tab.emoji}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: 4 }}>{tab.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>{tab.count}</div>
            </button>
          ))}
        </div>

        {/* Feedback List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-muted)' }}>読み込み中...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📭</div>
            <p>フィードバックはまだありません</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
            {feedbacks.map(fb => {
              const cat = CATEGORY_INFO[fb.category];
              const isReplyOpen = replyTargetId === fb.id;
              return (
                <div key={fb.id} style={{
                  background: 'white', borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-lg)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${cat.color}`,
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span style={{
                        background: `${cat.color}15`, color: cat.color,
                        padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700,
                      }}>
                        {cat.emoji} {cat.label}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {fb.nickname || '匿名'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span style={{ fontSize: '0.8rem', color: '#EF4444' }}>❤️ {fb.likes}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(fb.created_at).toLocaleString('ja-JP')}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 'var(--space-md)', whiteSpace: 'pre-wrap' }}>
                    {fb.message}
                  </p>

                  {/* Existing Replies */}
                  {fb.replies && fb.replies.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      {fb.replies.map(reply => (
                        <div key={reply.id} style={{
                          background: '#F0FDF4', borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-sm) var(--space-md)', marginBottom: 6,
                          borderLeft: '3px solid #22C55E',
                        }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', marginBottom: 4 }}>
                            🛡️ 運営チーム · {new Date(reply.created_at).toLocaleString('ja-JP')}
                          </p>
                          <p style={{ fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Action */}
                  {isReplyOpen ? (
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                      <textarea
                        className="input-field"
                        placeholder="返信を入力..."
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        rows={2}
                        style={{ flex: 1, resize: 'none' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={!replyMessage.trim() || sending}
                          onClick={() => handleReply(fb.id)}
                          style={{ fontSize: '0.8rem' }}
                        >
                          {sending ? '...' : '送信'}
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => { setReplyTargetId(null); setReplyMessage(''); }}
                          style={{ fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--color-border)' }}
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyTargetId(fb.id)}
                      style={{
                        background: 'transparent', border: '1px solid var(--color-border)',
                        borderRadius: 8, padding: '6px 14px', fontSize: '0.8rem',
                        color: 'var(--color-text-secondary)', cursor: 'pointer',
                      }}
                    >
                      💬 返信する
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
