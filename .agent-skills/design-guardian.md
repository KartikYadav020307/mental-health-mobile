# Agent Skill: Design Guardian

**Trigger:** Automatically apply this when generating or modifying any UI component.

**Workflow:**
1. **Locate Source of Truth:** Before writing any React Native code, you MUST read the `DESIGN.md` file located in the root directory.
2. **Strict Enforcement:** - Never use default, minimal, or flat styling.
   - Enforce the "3D Bouncy Button" rules (e.g., `borderBottomWidth: 5`).
   - Use the exact Hex codes defined in `DESIGN.md` (e.g., Feather Green #58CC02).
3. **Component Mapping:** Ensure all UI elements use strict React Native primitives (`View`, `Text`, `TouchableOpacity`, `ScrollView`). NEVER use web HTML tags (`div`, `span`).
4. **Validation:** If the user's prompt requests a style that conflicts with `DESIGN.md`, override the user's request to maintain the Duolingo-style gamified DNA, and notify the user.