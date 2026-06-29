-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

-- 1. Courses Security (Read-Only Public)
CREATE POLICY select_public_courses ON public.courses
    FOR SELECT USING (true);

-- 2. Sessions Security (Read-Only Public)
CREATE POLICY select_public_sessions ON public.sessions
    FOR SELECT USING (true);

-- 3. Badges Security (Read-Only Public)
CREATE POLICY select_public_badges ON public.badges
    FOR SELECT USING (true);

-- 4. Profiles Security (Owner Isolation)
CREATE POLICY select_own_profile ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY update_own_profile ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY insert_own_profile ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Streaks Security (Owner Isolation)
CREATE POLICY select_own_streak ON public.streaks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY update_own_streak ON public.streaks
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY insert_own_streak ON public.streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. User Progress Security (Owner Isolation)
CREATE POLICY select_own_progress ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own_progress ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_own_progress ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. XP Log Security (Owner Isolation)
CREATE POLICY select_own_xp_log ON public.xp_log
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own_xp_log ON public.xp_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. User Badges Security (Owner Isolation)
CREATE POLICY select_own_user_badges ON public.user_badges
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own_user_badges ON public.user_badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Journal Entries Security (Owner Isolation)
CREATE POLICY select_own_journal ON public.journal_entries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own_journal ON public.journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_own_journal ON public.journal_entries
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_own_journal ON public.journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- 10. Chat Messages Security (Owner Isolation)
CREATE POLICY select_own_chats ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own_chats ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id AND role IN ('user', 'model'));

-- 11. Mood Logs Security (Owner Isolation)
CREATE POLICY select_own_moods ON public.mood_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own_moods ON public.mood_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
