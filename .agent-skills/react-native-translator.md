# Agent Skill: React Native UI Translator

**Trigger:** When the user asks to "translate this design" or "build this UI component".

**Workflow:**
1. **Analyze:** Review the requested visual design or reference code.
2. **Component Map:** Map all visual elements to strict React Native primitives (`View`, `Text`, `TouchableOpacity`, `ScrollView`, `Image`). NEVER use web HTML tags (`div`, `span`).
3. **Style Extraction:** Extract all visual properties into a `StyleSheet.create({})` object at the bottom of the file. NEVER use inline styles unless the value is dynamically calculated via state.
4. **Brand Check:** Cross-reference `DESIGN.md` in the root directory. Ensure border radiuses, bouncy button logic (`borderBottomWidth: 5`), and the Serenova color palette are strictly applied.
5. **Iconography:** Use `@expo/vector-icons` exclusively.

**Output:** Provide the clean, refactored TypeScript component and wait for user approval.