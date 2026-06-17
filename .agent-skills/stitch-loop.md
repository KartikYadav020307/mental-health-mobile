# Agent Skill: Stitch-Loop (UI Refinement)

**Trigger:** When the user asks to "tweak", "adjust", "refine", or "fix the styling" of an existing component.

**Workflow:**
1. **Isolate:** Identify the specific visual property the user wants to change (e.g., padding, font size, color).
2. **Preserve Logic (CRITICAL):** Do NOT alter any `useEffect`, `useState`, or functional validation logic in the file. Your scope is strictly limited to the `StyleSheet` and JSX layout structure.
3. **Micro-Adjustment:** Make the precise styling adjustment requested. 
4. **Console Check:** Ensure your styling changes do not introduce any React Native styling errors (e.g., applying text styles to a `View`).

**Output:** Show a fast, minimal code diff of the `StyleSheet` or JSX changes. Ask "Does this layout look better?"