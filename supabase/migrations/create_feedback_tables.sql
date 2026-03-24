-- ================================================================
-- あんしんスイーツ: フィードバックシステム テーブル作成
-- Supabase SQL Editor で実行してください
-- ================================================================

-- 1. フィードバックテーブル
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('bug', 'improvement', 'idea', 'other')),
  message TEXT NOT NULL,
  nickname TEXT DEFAULT '',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 返信テーブル
CREATE TABLE IF NOT EXISTS feedback_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLSポリシー（誰でも読み書き可能）
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feedbacks" ON feedbacks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert feedbacks" ON feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update feedback likes" ON feedbacks FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read replies" ON feedback_replies FOR SELECT USING (true);
CREATE POLICY "Anyone can insert replies" ON feedback_replies FOR INSERT WITH CHECK (true);
