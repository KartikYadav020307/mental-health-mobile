# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# React Native Layout & Android Compatibility Rules

1. **Universal SafeArea (Modern Approach)**: Never use `StatusBar.currentHeight` as it fails on modern devices with dynamic islands and deep camera cutouts. Always import `useSafeAreaInsets` from `react-native-safe-area-context`. Inside the component, call `const insets = useSafeAreaInsets();` and apply `paddingTop: insets.top` (plus any necessary baseline margin, e.g., `insets.top + 10`) to the outermost container.

2. **Floating Bottom Tab Navigator Clearance**: This app uses a floating absolute-positioned Bottom Tab Navigator. To ensure bottom content (like the last item in a list) is fully reachable and not obscured, always apply a bottom padding of at least 120 to scrollable containers: `contentContainerStyle={{ paddingBottom: 120 }}` (or 130 if needed).

3. **Flex Grid Layouts (Wrap & Percentages)**: When building horizontal rows of cards or buttons that might exceed screen width or have varying content sizes, avoid relying solely on flex. Always use `flexDirection: 'row'`, `flexWrap: 'wrap'`, and `justifyContent: 'space-between'` on the container. Give the child items a percentage width (e.g., `width: '47%'`) and a `marginBottom` to create a bulletproof grid.

4. **Floating Action Buttons in Rows**: When building a custom Bottom Tab Navigator or a row with a prominent floating action button:
   - Ensure the row container uses `flexDirection: 'row'`, `justifyContent: 'space-around'`, and `alignItems: 'center'`.
   - The floating button MUST use `position: 'absolute'`, `alignSelf: 'center'` (or `right: 20` etc), an appropriate negative offset (e.g., `top: -30`), and a high `zIndex` so it doesn't break the layout flow.
   - If centering the button, inject an empty `<View style={{ flex: 1 }} />` or equivalent spacer in the middle of the mapped tab items.

5. **Strict Text Rendering & Crash Debugging**: React Native will crash with `Text strings must be rendered within a <Text> component` if any non-component value sits directly inside a layout component. When debugging this error:
   - **Check for Rogue Whitespace:** Look closely for accidental spaces between tags (e.g., `<View>  </View>`).
   - **Check Comment Syntax:** Ensure all JSX comments use `{/* comment */}`. Using standard `//` comments inside JSX will render as a raw text string and crash the app.
   - **Check Conditional Renders:** Ensure conditional statements do not accidentally evaluate to strings or numbers (e.g., `value && <View />` where `value` is a string or `0`). 
   - **The Bulletproof Fix:** If visual inspection fails to locate the rogue character or phantom whitespace, the fastest and most reliable fix is to cleanly rewrite the affected JSX return block to strip out all invisible formatting characters.

6. **Gamified 3D Buttons (Explicit 4-Sided Borders)**: When implementing a 3D "pop" or shadow effect for buttons/cards (e.g., Duolingo-style UI) in React Native, **DO NOT** use the nested "Shadow Wrapper" method with `translateY` or `paddingBottom` hacks, as this causes UI bleed and disjointed shadows on Android. Instead, use a SINGLE `<TouchableOpacity>` component and explicitly define all 4 borders to prevent Android's global border collapse. 
   - You MUST define exact widths: `borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 6`.
   - You MUST define exact colors for all 4 sides, using the base color for top/sides and a darker shade for the bottom shadow (e.g., `borderTopColor: '#E5E5E5', borderLeftColor: '#E5E5E5', borderRightColor: '#E5E5E5', borderBottomColor: '#CCCCCC'`).
