# QuickFleet Mobile Chatbot - Setup & Deployment Guide

## What Was Changed

I've successfully integrated a mobile-optimized chatbot into your QuickFleet mobile app. Here's what was added:

### Files Added/Modified:
1. **`components/Chatbot.tsx`** - New mobile chatbot component
2. **`app/_layout.tsx`** - Updated to include the chatbot on all screens
3. **`CHATBOT_INTEGRATION.md`** - Full documentation
4. **`TROUBLESHOOTING.md`** - Common issues and fixes

## Quick Start

### 1. **Clear All Build Caches**

Before running the app, clean everything:

```bash
# Windows PowerShell
Remove-Item -Path .expo -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path .tsbuildinfo -Force -ErrorAction SilentlyContinue
Remove-Item -Path node_modules/.cache -Recurse -Force -ErrorAction SilentlyContinue

# macOS/Linux
rm -rf .expo .tsbuildinfo node_modules/.cache
```

### 2. **Reinstall Dependencies**

```bash
# If using npm
npm install

# If using pnpm
pnpm install
```

### 3. **Start the Development Server**

```bash
npm run dev -- --clear
```

The `--clear` flag ensures Metro bundler starts fresh.

### 4. **Access the App**

- **iOS/Android:** Use Expo Go app and scan the QR code
- **Web:** Open http://localhost:8081 in your browser

## Environment Configuration

### Add to `.env` file:

```env
# Backend API URL (required)
EXPO_PUBLIC_API_URL=http://your-api-url:8080/api/v1

# Other existing variables...
```

**Important:** Environment variables must start with `EXPO_PUBLIC_` to be accessible in Expo apps.

## Architecture

The chatbot is implemented as a floating widget that appears on all screens:

```
RootLayout (app/_layout.tsx)
├── RootLayoutNav (Router - handles navigation)
├── Chatbot (Floating widget - overlays on top)
└── [All your screens are here]
```

## Component Structure

**`components/Chatbot.tsx`:**
- 💬 Message history with user/assistant roles
- ⚡ API integration to `/chatbot/ask` endpoint
- 🎨 Modern UI with gradient header
- 📱 Mobile-optimized (iOS, Android, Web)
- ♿ Accessible touch targets

**Features:**
- Quick-reply suggestions
- Real-time loading states
- Error handling with fallback messages
- Keyboard awareness
- Smooth scroll-to-bottom

## Backend API Requirements

Your backend must provide:

**Endpoint:** `POST /api/v1/chatbot/ask`

**Request Format:**
```json
{
  "message": "User's question or message"
}
```

**Expected Response:**
```json
{
  "data": {
    "reply": "Assistant's response"
  }
}
```

**Example Node.js/Express:**
```javascript
app.post('/api/v1/chatbot/ask', async (req, res) => {
  const { message } = req.body;
  
  // Your AI/ML logic here
  const reply = await generateChatbotResponse(message);
  
  res.json({
    data: {
      reply: reply
    }
  });
});
```

## Troubleshooting Metro Bundler Error

If you see:
```
Failed to load resource: the server responded with a status of 500
Refused to execute script from '...' because its MIME type ('application/json') is not executable
```

### Step 1: Clear Everything
```bash
npm run dev -- --clear
```

### Step 2: Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Step 3: Check for TypeScript Errors
```bash
npm run typecheck
```

### Step 4: Review Metro Bundler Logs

Look for specific error messages in the terminal output. Common issues:
- Invalid import paths
- Circular dependencies
- Missing dependencies
- Syntax errors in components

### Step 5: Restart Everything

1. Stop the dev server (Ctrl+C)
2. Clear caches (step 1 above)
3. Reinstall (step 2 above)
4. Restart: `npm run dev`

## Testing the Chatbot

### 1. **Test Locally**

- Open the app
- Tap the "💬 Chat" button in the bottom-right
- Type a message
- Tap "Send"
- Verify the message appears

### 2. **Test API Connection**

```bash
# Test your backend endpoint
curl -X POST http://localhost:8080/api/v1/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Expected response:
# {"data": {"reply": "Hello! How can I help?"}}
```

### 3. **Test Error Handling**

- Stop the backend service
- Try sending a message in the chatbot
- Verify error message: "Sorry, I couldn't reach the assistant service right now."

## Customization

### Change Suggestions

Edit `components/Chatbot.tsx`:
```typescript
const suggestions = [
  "How does QuickFleet work?",
  "How do I sign up as a rider?",
  "What are the payment options?",
  // Add your custom suggestions here
];
```

### Change Colors

In `components/Chatbot.tsx` StyleSheet:
```typescript
// Primary color (buttons, headers)
backgroundColor: "#2563eb",  // Change to your color

// Text colors
color: "#1f2937",  // Dark text

// Background
backgroundColor: "#fff",  // Chat window background
```

### Change Dimensions

```typescript
// Chat window width (currently 320)
width: 320,

// Maximum height (50% of screen or 500px, whichever is smaller)
const chatbotHeight = Math.min(windowHeight * 0.7, 500);
```

## Performance Tips

1. **Message Pagination:** For conversations longer than 100 messages, implement pagination
2. **Memoization:** Use `React.memo()` for message components
3. **Lazy Loading:** Load older messages on demand

Example optimization:
```typescript
const MessageBubble = React.memo(({ message }) => (
  // Message UI here
));
```

## Deployment

### iOS (via EAS)
```bash
eas build --platform ios
```

### Android (via EAS)
```bash
eas build --platform android
```

### Web
```bash
npm run build
```

### Environment Variables for Production

Create `.env.production`:
```env
EXPO_PUBLIC_API_URL=https://your-production-api.com/api/v1
```

## Monitoring & Analytics

Consider adding:
1. **Analytics:** Track chatbot usage
2. **Error Reporting:** Log failed API calls
3. **User Feedback:** Rate message helpfulness
4. **Metrics:** Average response time, conversation length

## Security Considerations

1. **API Keys:** Don't hardcode API keys in the app
2. **HTTPS:** Use HTTPS for production
3. **Input Validation:** Sanitize user messages on the backend
4. **Rate Limiting:** Implement rate limits on `/chatbot/ask`
5. **Authentication:** Consider requiring user authentication

## Future Enhancements

- 📎 File upload support
- 🎤 Voice input/output
- 💾 Message history persistence
- 🔍 Message search
- 🌐 Multi-language support
- 📊 Conversation analytics
- 🎯 Personalization by user type

## FAQ

**Q: Does the chatbot work offline?**  
A: No, it requires an active internet connection to reach the backend API.

**Q: Can I customize the chatbot UI?**  
A: Yes, edit `components/Chatbot.tsx` to modify colors, sizes, and text.

**Q: How do I disable the chatbot?**  
A: Remove the `<Chatbot />` line from `app/_layout.tsx`.

**Q: Can I add chat history persistence?**  
A: Yes, use AsyncStorage to save messages locally.

**Q: How do I add authentication?**  
A: Add JWT token to the request headers in `sendMessage()`.

## Support Resources

- **Expo Documentation:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Metro Bundler:** https://metrobundler.dev
- **Your Backend Docs:** [Link to your API documentation]

## Verification Checklist

- [ ] All caches cleared
- [ ] Dependencies reinstalled
- [ ] `.env` file configured with `EXPO_PUBLIC_API_URL`
- [ ] Backend `/chatbot/ask` endpoint working
- [ ] Dev server running without errors
- [ ] Chatbot button appears in the app
- [ ] Can open/close chat window
- [ ] Can send messages (if backend is running)
- [ ] Suggestions work correctly

## Need Help?

1. Check `TROUBLESHOOTING.md` for common issues
2. Review the component source in `components/Chatbot.tsx`
3. Test the backend endpoint directly
4. Check browser console for errors (web)
5. Check Expo logs for errors (mobile)

