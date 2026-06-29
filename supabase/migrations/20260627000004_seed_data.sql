-- Migration: Seed Serenova Content
-- Path: supabase/migrations/20260627000004_seed_data.sql

-- Clean up any existing seed data (useful for reset/reseed operations)
TRUNCATE public.sessions CASCADE;
TRUNCATE public.courses CASCADE;
TRUNCATE public.badges CASCADE;

-- 1. Seed Courses
INSERT INTO public.courses (id, title, description, category, session_count, xp_reward, icon) VALUES
(
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0', 
  'Introduction to Mindfulness', 
  'Learn the core principles of mindfulness meditation in 10 daily sessions. Develop a daily habit and bring calm to your everyday life.', 
  'Growth', 
  10,
  300,
  'seedling'
),
(
  'a0a0a0a0-0000-4000-a000-000000000001', 
  'Overcoming Panic', 
  'Quick techniques for high-anxiety situations.', 
  'Anxiety', 
  3,
  150,
  'lungs'
),
(
  'a0a0a0a0-0000-4000-a000-000000000002', 
  'Deep Work Session', 
  'Focus guides designed to increase cognitive stamina.', 
  'Focus', 
  0,
  200,
  'brain'
),
(
  'a0a0a0a0-0000-4000-a000-000000000003', 
  'Finding Purpose', 
  'Explore value-alignment meditations.', 
  'Growth', 
  0,
  300,
  'seedling'
),
(
  'a0a0a0a0-0000-4000-a000-000000000004', 
  'Immediate Relief', 
  'Fast-acting emergency breathing sequences.', 
  'SOS', 
  0,
  50,
  'life-ring'
),
(
  'a0a0a0a0-0000-4000-a000-000000000005', 
  'Social Anxiety', 
  'Practices to ground yourself before social encounters.', 
  'Anxiety', 
  0,
  150,
  'users'
),
(
  'a0a0a0a0-0000-4000-a000-000000000006', 
  'Flow State', 
  'Meditations to ease into creative or operational flow.', 
  'Focus', 
  0,
  250,
  'water'
);

-- 2. Seed Sessions (Course Sessions, Singles, and Sleepcasts)
INSERT INTO public.sessions (id, title, category, type, duration_sec, audio_url, narrator, order_in_course, xp_reward, icon, course_id) VALUES
-- =========================================================================
-- COURSE SESSIONS (Introduction to Mindfulness: 10 Sessions)
-- =========================================================================
(
  'e01a0c0a-0001-4217-bc4e-2895f32ebf01', 
  'Day 1: The Present Moment', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
  'Sarah Jenkins', 
  1, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0002-4217-bc4e-2895f32ebf02', 
  'Day 2: Breathing Space', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 
  'Sarah Jenkins', 
  2, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0003-4217-bc4e-2895f32ebf03', 
  'Day 3: Body Scan', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 
  'Sarah Jenkins', 
  3, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0004-4217-bc4e-2895f32ebf04', 
  'Day 4: Observing Thoughts', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 
  'Sarah Jenkins', 
  4, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0005-4217-bc4e-2895f32ebf05', 
  'Day 5: Working with Distractions', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 
  'Sarah Jenkins', 
  5, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0006-4217-bc4e-2895f32ebf06', 
  'Day 6: Softening Resistance', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 
  'Sarah Jenkins', 
  6, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0007-4217-bc4e-2895f32ebf07', 
  'Day 7: Kind Awareness', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 
  'Sarah Jenkins', 
  7, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0008-4217-bc4e-2895f32ebf08', 
  'Day 8: Emotional Balance', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 
  'Sarah Jenkins', 
  8, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0009-4217-bc4e-2895f32ebf09', 
  'Day 9: Integrating Mindfulness', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 
  'Sarah Jenkins', 
  9, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),
(
  'e01a0c0a-0010-4217-bc4e-2895f32ebf10', 
  'Day 10: Establishing a Practice', 
  'Growth', 
  'course', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 
  'Sarah Jenkins', 
  10, 
  50,
  'leaf',
  'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0'
),

-- =========================================================================
-- COURSE SESSIONS (Overcoming Panic: 3 Sessions)
-- =========================================================================
(
  'e01a0c0a-0101-4217-bc4e-2895f32ebf01',
  'Box Breathing Basic',
  'Anxiety',
  'course',
  300,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'Dr. Sarah Carter',
  1,
  50,
  'lungs',
  'a0a0a0a0-0000-4000-a000-000000000001'
),
(
  'e01a0c0a-0102-4217-bc4e-2895f32ebf02',
  'Physical Grounding 5-4-3-2-1',
  'Anxiety',
  'course',
  450,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'Dr. Sarah Carter',
  2,
  50,
  'lungs',
  'a0a0a0a0-0000-4000-a000-000000000001'
),
(
  'e01a0c0a-0103-4217-bc4e-2895f32ebf03',
  'Calming the Mind',
  'Anxiety',
  'course',
  600,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'Dr. Sarah Carter',
  3,
  50,
  'lungs',
  'a0a0a0a0-0000-4000-a000-000000000001'
),

-- =========================================================================
-- SINGLES (15 Sessions distributed across categories)
-- =========================================================================
(
  'e02a0c0a-0001-4217-bc4e-2895f32ebf01', 
  'Unwinding Anxiety', 
  'Anxiety', 
  'single', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 
  'David Vance', 
  NULL, 
  50,
  'wind',
  NULL
),
(
  'e02a0c0a-0002-4217-bc4e-2895f32ebf02', 
  'Panic Button', 
  'SOS', 
  'single', 
  180, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 
  'Michael Chen', 
  NULL, 
  50,
  'exclamation-triangle',
  NULL
),
(
  'e02a0c0a-0003-4217-bc4e-2895f32ebf03', 
  'Deep Work Prep', 
  'Focus', 
  'single', 
  300, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 
  'David Vance', 
  NULL, 
  50,
  'briefcase',
  NULL
),
(
  'e02a0c0a-0004-4217-bc4e-2895f32ebf04', 
  'Self-Compassion Break', 
  'Growth', 
  'single', 
  480, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 
  'Sarah Jenkins', 
  NULL, 
  50,
  'heart',
  NULL
),
(
  'e02a0c0a-0005-4217-bc4e-2895f32ebf05', 
  'Body Scan Relaxer', 
  'Tools', 
  'single', 
  900, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 
  'Sarah Jenkins', 
  NULL, 
  50,
  'compress',
  NULL
),
(
  'e02a0c0a-0006-4217-bc4e-2895f32ebf06', 
  'Social Anxiety Relief', 
  'Anxiety', 
  'single', 
  720, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 
  'Sarah Jenkins', 
  NULL, 
  50,
  'users',
  NULL
),
(
  'e02a0c0a-0007-4217-bc4e-2895f32ebf07', 
  'SOS Calm Down', 
  'SOS', 
  'single', 
  300, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
  'Michael Chen', 
  NULL, 
  50,
  'life-ring',
  NULL
),
(
  'e02a0c0a-0008-4217-bc4e-2895f32ebf08', 
  'Flow State Finder', 
  'Focus', 
  'single', 
  900, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 
  'Michael Chen', 
  NULL, 
  50,
  'water',
  NULL
),
(
  'e02a0c0a-0009-4217-bc4e-2895f32ebf09', 
  'Patience Practice', 
  'Growth', 
  'single', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 
  'David Vance', 
  NULL, 
  50,
  'hourglass-half',
  NULL
),
(
  'e02a0c0a-0010-4217-bc4e-2895f32ebf10', 
  'Mindful Journaling Prep', 
  'Tools', 
  'single', 
  420, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 
  'Michael Chen', 
  NULL, 
  50,
  'pen',
  NULL
),
(
  'e02a0c0a-0011-4217-bc4e-2895f32ebf11', 
  'Easing Work Stress', 
  'Anxiety', 
  'single', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 
  'Sarah Jenkins', 
  NULL, 
  50,
  'laptop-house',
  NULL
),
(
  'e02a0c0a-0012-4217-bc4e-2895f32ebf12', 
  'Rapid Relief', 
  'SOS', 
  'single', 
  120, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 
  'Michael Chen', 
  NULL, 
  50,
  'bolt',
  NULL
),
(
  'e02a0c0a-0013-4217-bc4e-2895f32ebf13', 
  'Creative Flow Spark', 
  'Focus', 
  'single', 
  600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 
  'Sarah Jenkins', 
  NULL, 
  50,
  'lightbulb',
  NULL
),
(
  'e02a0c0a-0014-4217-bc4e-2895f32ebf14', 
  'Loving-Kindness Practice', 
  'Growth', 
  'single', 
  720, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 
  'Michael Chen', 
  NULL, 
  50,
  'smile',
  NULL
),
(
  'e02a0c0a-0015-4217-bc4e-2895f32ebf15', 
  'Daily Intention Setting', 
  'Tools', 
  'single', 
  300, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 
  'David Vance', 
  NULL, 
  50,
  'calendar-check',
  NULL
),

-- =========================================================================
-- SLEEPCASTS (5 Sleep Soundscapes)
-- =========================================================================
(
  'e03a0c0a-0001-4217-bc4e-2895f32ebf01', 
  'Rainy Night in Kyoto', 
  'Sleep', 
  'sleepcast', 
  2700, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 
  'Kaito Sato', 
  NULL, 
  50,
  'moon',
  NULL
),
(
  'e03a0c0a-0002-4217-bc4e-2895f32ebf02', 
  'The Midnight Library', 
  'Sleep', 
  'sleepcast', 
  3600, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 
  'Helena Bonham', 
  NULL, 
  50,
  'book-reader',
  NULL
),
(
  'e03a0c0a-0003-4217-bc4e-2895f32ebf03', 
  'Desert Wind Down', 
  'Sleep', 
  'sleepcast', 
  2700, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 
  'Marcus Aurelius', 
  NULL, 
  50,
  'wind',
  NULL
),
(
  'e03a0c0a-0004-4217-bc4e-2895f32ebf04', 
  'Ocean Whispers', 
  'Sleep', 
  'sleepcast', 
  7200, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 
  'Aria Oceanus', 
  NULL, 
  50,
  'water',
  NULL
),
(
  'e03a0c0a-0005-4217-bc4e-2895f32ebf05', 
  'Starlit Campfire', 
  'Sleep', 
  'sleepcast', 
  5400, 
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 
  'David Attenborough', 
  NULL, 
  50,
  'fire',
  NULL
);

-- 3. Seed Badges (Default Gamified Badges for Milestones)
INSERT INTO public.badges (id, code, title, description, icon, color, shadow_color, xp_reward, criteria_json) VALUES
(
  'b01a0c0a-0001-4217-bc4e-2895f32ebf01', 
  'early-bird', 
  'Early Bird', 
  'Complete a meditation before 8:00 AM.', 
  'sun', 
  '#1CB0F6', 
  '#1899D6', 
  50,
  '{"hour_limit": 8}'
),
(
  'b01a0c0a-0002-4217-bc4e-2895f32ebf02', 
  'three-day-streak', 
  '3 Day Streak', 
  'Maintain a consecutive 3-day active streak.', 
  'fire', 
  '#FFC800', 
  '#E5B400', 
  50,
  '{"streak_days": 3}'
),
(
  'b01a0c0a-0003-4217-bc4e-2895f32ebf03', 
  'zen-master', 
  'Zen Master', 
  'Accumulated 300 minutes of meditation.', 
  'leaf', 
  '#58CC02', 
  '#58A700', 
  50,
  '{"minutes_meditated": 300}'
),
(
  'b01a0c0a-0004-4217-bc4e-2895f32ebf04', 
  'night-owl', 
  'Night Owl', 
  'Complete a sleep exercise after 10:00 PM.', 
  'moon', 
  '#9356D6', 
  '#7743CE', 
  50,
  '{"hour_start": 22}'
),
(
  'b01a0c0a-0005-4217-bc4e-2895f32ebf05', 
  'first-breath', 
  'First Breath', 
  'Completed your first meditation session.', 
  'trophy', 
  '#FFC800', 
  '#E5B400', 
  50,
  '{"sessions_completed": 1}'
);
