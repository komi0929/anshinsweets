import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export type FeedbackCategory = 'bug' | 'improvement' | 'idea' | 'other';

export interface Feedback {
  id: string;
  category: FeedbackCategory;
  message: string;
  nickname: string;
  likes: number;
  created_at: string;
  replies?: FeedbackReply[];
}

export interface FeedbackReply {
  id: string;
  feedback_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export const CATEGORY_INFO: Record<FeedbackCategory, { label: string; emoji: string; color: string }> = {
  bug: { label: 'バグ報告', emoji: '🐛', color: '#EF4444' },
  improvement: { label: '改善提案', emoji: '💡', color: '#F59E0B' },
  idea: { label: '新サービスアイデア', emoji: '🚀', color: '#3B82F6' },
  other: { label: 'その他', emoji: '💬', color: '#6B7280' },
};

// ── Feedback CRUD ──

export async function getFeedbacks(category?: FeedbackCategory): Promise<Feedback[]> {
  if (!supabase) return [];
  try {
    let query = supabase
      .from('feedbacks')
      .select('*, feedback_replies(*)')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((f: Record<string, unknown>) => ({
      ...f,
      replies: (f.feedback_replies as FeedbackReply[]) || [],
    })) as Feedback[];
  } catch (err) {
    console.error('[Feedback] getFeedbacks error:', err);
    return [];
  }
}

export async function createFeedback(
  category: FeedbackCategory,
  message: string,
  nickname: string = ''
): Promise<Feedback | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({ category, message, nickname })
      .select()
      .single();

    if (error) throw error;
    return data as Feedback;
  } catch (err) {
    console.error('[Feedback] createFeedback error:', err);
    return null;
  }
}

export async function likeFeedback(id: string, currentLikes: number): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('feedbacks')
      .update({ likes: currentLikes + 1 })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Feedback] likeFeedback error:', err);
    return false;
  }
}

export async function createReply(
  feedbackId: string,
  message: string,
  isAdmin: boolean = true
): Promise<FeedbackReply | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('feedback_replies')
      .insert({ feedback_id: feedbackId, message, is_admin: isAdmin })
      .select()
      .single();

    if (error) throw error;
    return data as FeedbackReply;
  } catch (err) {
    console.error('[Feedback] createReply error:', err);
    return null;
  }
}
