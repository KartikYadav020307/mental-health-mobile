# Serenova UI/UX Guidelines (Strict Duolingo DNA)

**Core Mandate:** This app uses a highly gamified, chunky, physical UI design. NEVER use minimal, flat, or corporate styling.

**1. Typography:**
- Use highly legible, rounded sans-serif fonts. 
- Headers and primary buttons must use `fontWeight: '800'` or `'900'`.

**2. The 3D Bouncy Button Rule:**
ALL interactive cards and primary buttons must simulate physical depth using this exact React Native StyleSheet logic:
- `borderRadius: 16` (minimum)
- `borderWidth: 2`, `borderColor: '#E5E5E5'` (for uncolored surfaces)
- `borderBottomWidth: 5` (Mandatory to create the 3D shadow effect)

**3. Global Color Palette:**
- Feather Green: `#58CC02` (Primary actions, 'Next' buttons, success)
- Green Shadow: `#58A700` (Used for the `borderBottomColor` of green buttons)
- Macaw Blue: `#1CB0F6` (Secondary actions)
- Bee Yellow: `#FFC800` (Streaks, XP, Badges)
- Hare Light Grey: `#E5E5E5` (Borders, inactive states)
- Deep Indigo: `#1A1F2B` (Used ONLY for the Sleep Tab background)