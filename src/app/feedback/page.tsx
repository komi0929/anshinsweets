'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  getFeedbacks,
  createFeedback,
  likeFeedback,
  CATEGORY_INFO,
  type Feedback,
  type FeedbackCategory,
} from '@/lib/feedback';
import { APP_NAME } from '@/lib/constants';

const LIKED_KEY = 'anshin_feedback_liked';

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'たった今';
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  return new Date(dateStr).toLocaleDateString('ja-JP');
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedbackCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>('improvement');
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(LIKED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const loadFeedbacks = async () => {
    setLoading(true);
    const data = await getFeedbacks(activeTab === 'all' ? undefined : activeTab);
    setFeedbacks(data);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      const data = await getFeedbacks(activeTab === 'all' ? undefined : activeTab);
      if (!ignore) {
        setFeedbacks(data);
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [activeTab]);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    const result = await createFeedback(category, message.trim(), nickname.trim());
    if (result) {
      setMessage('');
      setNickname('');
      setShowForm(false);
      await loadFeedbacks();
    } else {
      alert('送信に失敗しました。もう一度お試しください。');
    }
    setSubmitting(false);
  };

  const handleLike = async (fb: Feedback) => {
    if (likedIds.includes(fb.id)) return;
    const success = await likeFeedback(fb.id, fb.likes);
    if (success) {
      const newLiked = [...likedIds, fb.id];
      setLikedIds(newLiked);
      localStorage.setItem(LIKED_KEY, JSON.stringify(newLiked));
      setFeedbacks(prev => prev.map(f => f.id === fb.id ? { ...f, likes: f.likes + 1 } : f));
    }
  };

  const tabs: { key: FeedbackCategory | 'all'; label: string; emoji: string }[] = [
    { key: 'all', label: 'すべて', emoji: '📋' },
    ...Object.entries(CATEGORY_INFO).map(([k, v]) => ({ key: k as FeedbackCategory, label: v.label, emoji: v.emoji })),
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME}</span>
          </Link>
          <div className="navbar-links">
            <Link href="/" className="navbar-link">ホーム</Link>
          </div>
        </div>
      </nav>

      <main className="container" style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-xl) var(--space-md) 120px' }}>
        {/* Header */}
        <div className="animate-fadeIn" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-sm)' }}>💬</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>ご意見・ご感想</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            あんしんスイーツをもっと良くするため、<br/>皆さまのご意見をお聞かせください
          </p>
        </div>

        {/* Write Button */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ fontSize: '1rem', padding: '12px 32px' }}
          >
            {showForm ? '✕ 閉じる' : '✏️ 意見を書く'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card animate-fadeInUp" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>新しい意見を投稿</h2>

            {/* Category Select */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 'var(--space-sm)' }}>
                カテゴリ
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(CATEGORY_INFO).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setCategory(k as FeedbackCategory)}
                    style={{
                      padding: '8px 14px', borderRadius: 20, border: '2px solid',
                      borderColor: category === k ? v.color : 'var(--color-border)',
                      background: category === k ? `${v.color}15` : 'white',
                      color: category === k ? v.color : 'var(--color-text-secondary)',
                      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {v.emoji} {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nickname */}
            <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="input-label" htmlFor="fb-nickname">ニックネーム（任意）</label>
              <input
                id="fb-nickname"
                className="input-field"
                type="text"
                placeholder="匿名でもOK"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={20}
              />
            </div>

            {/* Message */}
            <div className="input-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="input-label" htmlFor="fb-message">ご意見・ご感想 *</label>
              <textarea
                id="fb-message"
                className="input-field"
                placeholder="ここに入力してください..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                style={{ resize: 'vertical', minHeight: 100 }}
                maxLength={1000}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                {message.length}/1000
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleSubmit}
              disabled={!message.trim() || submitting}
              style={{ fontSize: '1rem' }}
            >
              {submitting ? '送信中...' : '📨 送信する'}
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto',
          paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-lg)',
          WebkitOverflowScrolling: 'touch',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none',
                background: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                color: activeTab === tab.key ? 'white' : 'var(--color-text-secondary)',
                fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s ease',
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        {loading ? (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state animate-fadeInUp" style={{ minHeight: 200 }}>
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">まだ投稿がありません</h3>
            <p className="empty-state-desc">最初の意見を投稿してみましょう！</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {feedbacks.map((fb, i) => {
              const cat = CATEGORY_INFO[fb.category];
              const isLiked = likedIds.includes(fb.id);
              return (
                <div
                  key={fb.id}
                  className={`card animate-fadeInUp stagger-${Math.min(i % 5 + 1, 5)}`}
                  style={{ padding: 'var(--space-lg)', position: 'relative' }}
                >
                  {/* Category Badge + Time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: `${cat.color}15`, color: cat.color,
                      padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {cat.emoji} {cat.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {getTimeAgo(fb.created_at)}
                    </span>
                  </div>

                  {/* Nickname */}
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4, fontWeight: 600 }}>
                    {fb.nickname || '匿名ユーザー'}
                  </p>

                  {/* Message */}
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text)', marginBottom: 'var(--space-md)', whiteSpace: 'pre-wrap' }}>
                    {fb.message}
                  </p>

                  {/* Like Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <button
                      onClick={() => handleLike(fb)}
                      disabled={isLiked}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 20,
                        border: isLiked ? '2px solid #EF4444' : '2px solid var(--color-border)',
                        background: isLiked ? '#FEF2F2' : 'white',
                        color: isLiked ? '#EF4444' : 'var(--color-text-secondary)',
                        fontWeight: 700, fontSize: '0.85rem', cursor: isLiked ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isLiked ? '❤️' : '🤍'} {fb.likes}
                    </button>
                  </div>

                  {/* Admin Replies */}
                  {fb.replies && fb.replies.length > 0 && (
                    <div style={{ marginTop: 'var(--space-md)', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-md)' }}>
                      {fb.replies.map(reply => (
                        <div key={reply.id} style={{
                          background: reply.is_admin ? '#F0FDF4' : 'var(--color-bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-sm) var(--space-md)',
                          marginBottom: 'var(--space-sm)',
                          borderLeft: reply.is_admin ? '3px solid var(--color-safe)' : 'none',
                        }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: reply.is_admin ? 'var(--color-safe)' : 'var(--color-text-muted)', marginBottom: 4 }}>
                            {reply.is_admin ? '🛡️ 運営チーム' : 'ユーザー'} · {getTimeAgo(reply.created_at)}
                          </p>
                          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
