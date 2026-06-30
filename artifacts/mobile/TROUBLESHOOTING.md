# Troubleshooting Guide - Mobile App Build Issues

## Issue: Metro Bundler 500 Error

**Error Message:**
```
GET http://localhost:8081/node_modules/... 500 (Internal Server Error)
Refused to execute script from '...' because its MIME type ('application/json') is not executable
```

### Causes & Solutions

#### 1. **Build Cache Issues** (Most Common)
The bundler cache gets corrupted after adding new components or dependencies.

**Solution:**
```bash
# Clear all caches
rm -rf .expo
rm -rf .tsbuildinfo
rm -rf node_modules/.cache
rm -rf node_modules/.pnpm

# Reinstall dependencies
npm install
# or
pnpm install

# Restart the dev server
npm run dev
```

#### 2. **React Compiler Configuration**
The Babel React compiler plugin may have issues.

**Check `babel.config.js`:**
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    // Remove if you don't need it:
    // plugins: ["babel-plugin-react-compiler"]
  };
};
```

#### 3. **TypeScript Path Issues**
The `@/*` path alias might not be resolving correctly.

**Verify `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### 4. **Component Import Issues**
Ensure all imports use correct paths and file extensions.

**Correct:**
```tsx
import { Chatbot } from "@/components/Chatbot";
```

**Incorrect (will fail):**
```tsx
import Chatbot from "@/components/Chatbot.tsx";  // Don't include .tsx
```

## Issue: Chatbot Not Appearing

### Check the Following:

1. **Verify the component is imported:**
   ```tsx
   import { Chatbot } from "@/components/Chatbot";
   ```

2. **Ensure it's rendered in the layout:**
   ```tsx
   <KeyboardProvider>
     <RootLayoutNav />
     <Chatbot />  // Must be here
   </KeyboardProvider>
   ```

3. **Check environment variable:**
   ```bash
   # In .env file
   EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

## Issue: API Calls Not Working

### Debugging Steps:

1. **Check the backend is running:**
   ```bash
   curl http://localhost:8080/api/v1/chatbot/ask
   ```

2. **Verify the endpoint exists:**
   - Endpoint: `POST /api/v1/chatbot/ask`
   - Expected response: `{ "data": { "reply": "..." } }`

3. **Check CORS configuration:**
   - Your backend should allow requests from the dev server
   - Add appropriate CORS headers

4. **Monitor network requests:**
   - Use React Native debugger or Expo debugger
   - Check if requests are being sent
   - Verify response status codes

## Issue: Animations Are Choppy

### Solutions:

1. **Ensure Reanimated is installed:**
   ```json
   "react-native-reanimated": "~4.1.1"
   ```

2. **Check for performance issues:**
   - Long message lists can cause lag
   - Implement virtualization for large lists
   - Use memoization for message components

3. **Rebuild native modules:**
   ```bash
   npm run dev -- --clear
   ```

## Issue: Keyboard Not Showing/Dismissing

### Solutions:

1. **Verify KeyboardProvider is present:**
   ```tsx
   import { KeyboardProvider } from "react-native-keyboard-controller";
   
   <KeyboardProvider>
     {/* Your app */}
   </KeyboardProvider>
   ```

2. **Platform-specific issues:**
   - iOS: Check `KeyboardAvoidingView` behavior
   - Android: Ensure `android:windowSoftInputMode="adjustResize"` in manifest

## General Debugging Tips

### 1. Clear Everything
```bash
# Windows (PowerShell)
Remove-Item -Path .expo -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path .tsbuildinfo -Force -ErrorAction SilentlyContinue
Remove-Item -Path node_modules/.cache -Recurse -Force -ErrorAction SilentlyContinue

# Mac/Linux
rm -rf .expo .tsbuildinfo node_modules/.cache
```

### 2. Restart Services
```bash
# Kill the dev server (Ctrl+C in terminal)

# Restart with fresh cache
npm run dev -- --clear
```

### 3. Check Logs
```bash
# More verbose logging
npm run dev -- --verbose
```

### 4. Validate JSON
Ensure all JSON files (package.json, tsconfig.json, app.json) are valid:
```bash
# Use an online JSON validator or:
node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')))"
```

### 5. Check for TypeScript Errors
```bash
npm run typecheck
```

## Platform-Specific Issues

### iOS Issues
- Keyboard not dismissing: Add `dismissKeyboardInteractive` to TextInput
- Safe area issues: Ensure SafeAreaProvider wraps the app

### Android Issues
- Keyboard not showing: Set `android:windowSoftInputMode` in AndroidManifest.xml
- Back button issues: Implement BackHandler in your screen

### Web Issues
- Chatbot positioning: May overlap with other elements
- Fix: Adjust z-index or use Portal/Modal

## Performance Optimization

If the app is slow:

1. **Use React DevTools Profiler:**
   - Identify which components are re-rendering
   - Memoize expensive components

2. **Optimize Message List:**
   ```tsx
   // Before: Renders all messages
   {messages.map(msg => <MessageBubble key={msg.id} {...msg} />)}
   
   // After: Only render visible messages
   <VirtualizedList
     data={messages}
     renderItem={({item}) => <MessageBubble {...item} />}
     keyExtractor={item => item.id.toString()}
   />
   ```

3. **Lazy Load Images:**
   - Use `expo-image` with caching
   - Load images only when visible

## Still Having Issues?

1. Check the console logs in Expo Go or your simulator
2. Look at the network tab in browser dev tools (for web)
3. Check the Terminal output where `npm run dev` is running
4. Review the component source code:
   - `components/Chatbot.tsx`
   - `app/_layout.tsx`

## Getting Help

- **Expo Documentation:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Metro Bundler Issues:** Check the Metro output for specific error messages
- **Your Backend Issues:** Ensure `/chatbot/ask` endpoint is working

