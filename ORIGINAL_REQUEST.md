# Original User Request

## Initial Request — 2026-06-27T16:57:02+05:30

# Serenova Roadmap — From Placeholders to Product

*Headspace's content trust + Duolingo's habit engine, built on what you already have.*

---

## 0. Where you actually stand right now

Pulling this straight from your code graph, not guesswork:

**Stack already chosen:** Expo / React Native, TypeScript, `expo-router`-adjacent navigation (`RootNavigator`  `BottomTabNavigator`), Supabase as backend, `@google/generative-ai` already wired in for an AI Coach, Reanimated v4 for animation, a "Serenova UI/UX Guidelines" design-system doc already in the repo (the `Design Guardian` / `React Native UI Translator` / `Stitch-Loop` agent trio).

**Screens that exist as shells:** `SplashScreen`, `AuthScreen`, `OnboardingScreen`, `HomeScreen`, `ExploreScreen`, `SleepScreen`, `ProgressScreen`, `ProfileScreen`, `AICoachScreen`, `AudioPlayerScreen`, `JournalScreen`, plus a `BottomNav` component.

**Data shapes that already exist somewhere in the code** (found as isolated/thin nodes — meaning they're declared but not yet wired to anything): `experienceLevels`, `goals`, `moods`, `personas`, `reminderTimes`, `categories`, `courses`, `sleepTracks`. This tells me onboarding's question set and the content taxonomy were already sketched, just never connected to a real data source or to the screens that should consume them.

**What the graph is telling you, bluntly:**
- `HomeScreen` and `ProgressScreen` are flagged as "semantically similar" — i.e., they're probably both stub components with placeholder text/layout and no real distinguishing logic yet.
- `JournalScreen` and `AICoachScreen` are flagged the same way — same situation.
- Almost nothing has Supabase calls wired in yet (`supabase` only has 7 edges total across the whole app — for a backend, that's a sign it's imported but barely used).
- 236 isolated nodes with 1 connection. That's your placeholder tax: a lot of scaffolding that nothing reads from or writes to yet.

So the honest read: **you have a skeleton with the right bones, no muscle.** Navigation works, screens render, but there's no real database schema behind it, no content, no tracking logic, and no gamification layer. That's normal for this stage — it just means the roadmap below is "wire the body up," not "redesign the skeleton."

---

## 1. The product thesis (condensed from the research)

Two things have to be true simultaneously or this doesn't work:

1. **It has to feel like Headspace** — calm, warm, never punitive, never gamified in a way that makes someone feel bad for missing a day. Mental health apps that copy Duolingo's *guilt* mechanics (broken streak = shame) actively harm retention and trust. Headspace's own data shows users react better to streaks framed as "minutes accumulated" than "don't break the chain."
2. **It has to feel like Duolingo** — daily habit loop, visible progress, small dopamine hits, a mascot/character with personality, a sense of leveling up. Not the anxiety-inducing parts. The *delight* parts.

The synthesis: **gamify effort and consistency, never gamify "failure."** No red broken-streak flames. No "you lost your progress." Streak freezes are generous and automatic, not something you have to remember to buy.

---

## 2. Information architecture (mapped onto your existing screens)

You don't need new screens for the MVP. You need to give the existing ones a job:

| Existing screen | Becomes | Core job |
|---|---|---|
| `SplashScreen` | Splash | Brand moment, loads session + cached content |
| `AuthScreen` | Auth | Supabase email/OAuth, anonymous-first option |
| `OnboardingScreen` | Onboarding quiz | Uses your existing `goals`, `experienceLevels`, `moods`, `reminderTimes` data  personalizes Home |
| `HomeScreen` | "Today" | Daily recommended session, streak/XP bar, continue-course card |
| `ExploreScreen` | Library | `categories`  `courses`  singles, browsable by theme |
| `SleepScreen` | Sleep | `sleepTracks` library, sleepcast-style long-form audio |
| `AudioPlayerScreen` | Player | Universal player for any session/sleepcast (shared across Home/Explore/Sleep) |
| `ProgressScreen` | Stats + achievements | Streak, total minutes, badges, level/XP |
| `JournalScreen` | Journal | Post-session reflection prompts, mood log over time |
| `AICoachScreen` | AI Coach | Gemini-backed conversational check-ins, references journal/mood history |
| `ProfileScreen` | Profile/Settings | Reminders, subscription, account |

No new IA needed. That's good news — this phase is about depth, not breadth.

---

## 3. The data model you're missing (Supabase schema)

This is the single highest-leverage thing to build first, because every screen is currently disconnected from real data. Minimum tables:

```
profiles          (user_id, display_name, experience_level, goals[], persona, reminder_time, created_at)
sessions          (id, title, category, type[course|single|sos|sleepcast], duration_sec, audio_url, narrator, order_in_course, course_id)
courses           (id, title, description, category, session_count)
user_progress     (user_id, session_id, completed_at, duration_listened_sec)
streaks           (user_id, current_streak, longest_streak, last_active_date, freezes_available)
xp_log            (user_id, amount, source, created_at)
badges            (id, name, description, icon, criteria_json)
user_badges       (user_id, badge_id, earned_at)
journal_entries   (user_id, mood, prompt, response, created_at)
ai_conversations  (user_id, message, role[user|assistant], created_at)
```

Row-level security on all of it (each user only reads their own rows except `sessions`/`courses`/`badges` which are public read). This unblocks everything else — Home's recommendation, Progress's stats, Journal's history, AI Coach's memory.

---

## 4. The gamification layer, calibrated for mental health (not copy-pasted from Duolingo)

| Mechanic | Duolingo version | Serenova version |
|---|---|---|
| Streak | Breaks  shame, red flame dies | Tracks total + current, **auto-freeze** on a missed day (no purchase, no guilt copy — "Life happens. Your streak is safe.") |
| XP | Points per lesson, leaderboard pressure | Points per **minute meditated**, no public leaderboard by default — optional opt-in friend comparison only |
| Levels | Skill tree, "Unit 4" | Soft "journey" framing — e.g., "Calm Explorer  Steady Mind  Deep Rest," tied to total minutes, not competition |
| Mascot | Duo the owl, guilt-trip notifications | A calm character (your existing brand work may already have one in the design guidelines) used for **encouragement only** — never nags, never threatens |
| Badges | Achievement pop-ups | Same idea, but copy is always supportive: "7 days of showing up for yourself," not "7-day streak!!" |
| Notifications | Aggressive, loss-framed ("Don't lose your streak!") | Gentle, time-of-day-aware, opt-in, never loss-framed |

This is the part of the roadmap most likely to get over-engineered into something that feels like Duolingo's anxiety-inducing notification engine. Resist that. Every gamification element should pass the test: *does this make someone feel cared for, or does it make them feel watched?*

---

## 5. Phased build plan

### Phase 0 — Foundation (1–2 weeks)
- Stand up the Supabase schema above + RLS policies
- Seed `courses`/`sessions` with real content: minimum **1 ten-session beginner course + ~15 singles + 5 sleepcasts** (you can record/license placeholder audio or use TTS narration as a stopgap)
- Wire `AuthScreen` to real Supabase auth (email + anonymous guest mode so onboarding doesn't have signup friction)
- Wire `OnboardingScreen`'s existing `goals`/`experienceLevels`/`moods`/`reminderTimes` data into a `profiles` row on completion

### Phase 1 — Make the shells real (2–3 weeks)
- `HomeScreen`: pull today's recommended session from `profiles.goals` + `user_progress`, show a real streak/XP summary pulled from `streaks`/`xp_log`
- `ExploreScreen`: render `categories`  `courses`/`sessions` from Supabase, not mock arrays
- `AudioPlayerScreen`: real playback (`expo-audio`), writes to `user_progress` + `xp_log` on completion, triggers streak update
- `SleepScreen`: same player, `sleepTracks` data source
- `ProgressScreen`: real stats query — streak, total minutes, sessions completed, badges earned
- Differentiate `HomeScreen` from `ProgressScreen` explicitly now (the graph flagged these as near-duplicates) — Home = "what to do today," Progress = "what you've already done"

### Phase 2 — Gamification layer (1–2 weeks)
- Streak engine with auto-freeze logic (cron/edge function checking `last_active_date`)
- XP accumulation + soft "journey" leveling on `ProgressScreen`
- 5–8 badges with the supportive-copy framing above, pop-up on `user_badges` insert
- Push notifications (`expo-notifications`) tied to `reminderTimes`, gentle copy only

### Phase 3 — AI Coach + Journal (2–3 weeks)
- `JournalScreen`: structured mood + reflection entries  `journal_entries`
- `AICoachScreen`: Gemini calls that pull recent `journal_entries` + `user_progress` as context, so the coach actually *knows* the user instead of being a generic chatbot — this is your real differentiator per the research (almost no competitor does this well)
- Clearly differentiate Journal (private reflection) from AI Coach (guided conversation) since the graph flagged these as near-duplicates too

### Phase 4 — Personalization, social, business model (ongoing)
- Recommendation logic: surface sleep content to users who selected "sleep" as a goal, etc.
- Optional opt-in friends/streak-sharing (never default-on)
- Subscription paywall: free tier (basics course + a handful of singles) vs. premium (full library, sleepcasts, AI Coach), using RevenueCat or Supabase + Stripe
- App Store assets, ASO, analytics (retention cohorts, D1/D7/D30) via EAS Observe (already in your stack)

---

## 6. Suggested execution order with Claude Code

Given everything lives in this repo already, the most efficient path is to hand Phase 0 and Phase 1 to Claude Code as discrete tickets, one screen/table at a time — small, testable diffs rather than one giant rewrite. A reasonable first session: "set up the Supabase schema from this roadmap, then wire `OnboardingScreen` to write a real `profiles` row." Second session: `HomeScreen` + `AudioPlayerScreen` together, since they share the playback/progress-write logic.

I'd suggest starting there rather than touching gamification or the AI Coach first — there's nothing to gamify or coach around until real data is flowing.

---

## 7. Open decisions before Phase 0 starts

A few things only you can answer, since they shape the schema and content pipeline:

- **Audio content:** real recorded narration, TTS as a placeholder, or licensed library content to start?
- **Mascot/character:** does the design system already have one, or does that need to be designed?
- **Monetization:** subscription-only like Headspace, or a free tier + one-time unlock for some content?
