# QuickFleet Mobile Chatbot Integration

## Overview

A mobile-optimized chatbot has been integrated into the QuickFleet mobile app. The chatbot provides real-time assistance to users and connects to the QuickFleet backend API for intelligent responses.

## Features

✨ **Mobile-Optimized UI**
- Responsive chat interface that adapts to different screen sizes
- Smooth animations for opening/closing
- Touch-friendly buttons and input fields

💬 **Smart Messaging**
- Message history with user and assistant roles
- Suggested quick-reply buttons for common questions
- Real-time loading indicators
- Error handling with fallback messages

🎨 **Design**
- Gradient header with modern styling
- Smooth scroll-to-bottom for new messages
- Keyboard awareness for proper spacing on iOS/Android
- Consistent with existing QuickFleet design language

## File Structure

```
wquickfleet-main/artifacts/mobile/
├── components/
│   └── Chatbot.tsx              # Mobile chatbot component
└── app/
    └── _layout.tsx              # Updated to include chatbot
```

## Implementation Details

### Component: `components/Chatbot.tsx`

The chatbot component is a React Native component that:

1. **Manages State**
   - `open`: Controls whether the chat window is visible
   - `messages`: Stores conversation history
   - `input`: Current user input
   - `loading`: Loading state during API calls

2. **API Integration**
   - Sends messages to `{API_BASE}/chatbot/ask`
   - Uses the `EXPO_PUBLIC_API_URL` environment variable
   - Falls back to `http://localhost:8080/api/v1` for local development

3. **Animations**
   - Uses React Native Animated API for smooth transitions
   - Spring animation for opening/closing the chat window
   - Scales smoothly with proper easing

4. **Keyboard Handling**
   - `KeyboardAvoidingView` for iOS compatibility
   - Automatic scroll-to-bottom when new messages arrive
   - Platform-specific behavior for iOS and Android

### Integration: `app/_layout.tsx`

The chatbot is added to the root layout, making it available across all screens in the app:

```tsx
<RootLayoutNav />
<Chatbot />
```

## Configuration

### Environment Variables

Add this to your `.env` file in the mobile app directory:

```env
EXPO_PUBLIC_API_URL=http://your-api-url:8080/api/v1
```

**Note:** Variables must be prefixed with `EXPO_PUBLIC_` to be accessible in Expo apps.

### Suggestions

Customize suggested messages in `components/Chatbot.tsx`:

```tsx
const suggestions = [
  "How does QuickFleet work?",
  "How do I sign up as a rider?",
  "What are the payment options?",
];
```

## API Endpoint Requirements

The chatbot expects the following endpoint on your backend:

**Endpoint:** `POST /chatbot/ask`

**Request:**
```json
{
  "message": "User's question or message"
}
```

**Response:**
```json
{
  "data": {
    "reply": "Assistant's response"
  }
}
```

If your backend returns a different structure, update the response parsing in the `sendMessage` function:

```tsx
const reply = result?.data?.reply || "Sorry, I couldn't get a response right now.";
```

## Styling & Customization

### Colors

Update the color scheme by modifying these values in `Chatbot.tsx`:

- **Primary Color:** `#2563eb` (blue)
- **Background:** `#fff` (white)
- **Text:** `#1f2937` (dark gray)
- **Borders:** `#e5e7eb` (light gray)

### Dimensions

Adjust chatbot size:

```tsx
const chatbotHeight = Math.min(windowHeight * 0.7, 500);
```

Change width (currently `320`):

```tsx
width: 320,  // Modify this value
```

## Usage

### For End Users

1. **Open the Chat** - Tap the "💬 Chat" button in the bottom-right corner
2. **Send a Message** - Type your question and tap "Send"
3. **Use Suggestions** - Tap quick-reply buttons for common questions
4. **Close the Chat** - Tap the "✕" button in the header

### For Developers

The chatbot is automatically rendered in the root layout and doesn't require manual integration on individual screens.

## Troubleshooting

### Chatbot Not Appearing

- Ensure `Chatbot.tsx` is properly imported in `_layout.tsx`
- Check that `RootLayoutNav` returns both `<Stack />` and `<Chatbot />`
- Verify the component is wrapped in proper providers

### API Connection Issues

- Check `EXPO_PUBLIC_API_URL` environment variable
- Ensure backend `/chatbot/ask` endpoint is accessible
- Verify network connectivity in the simulator/device
- Check browser console for CORS errors

### Messages Not Scrolling

- Ensure `ScrollView` ref is properly attached
- Verify `scrollToEnd` is called after messages update
- Check that `contentContainerStyle={{ gap: 8 }}` is present

### Animations Not Smooth

- Ensure `react-native-reanimated` is installed (in package.json)
- Check that native modules are properly linked
- Rebuild the app if animations are choppy

## Performance Considerations

- Messages are stored in component state (not recommended for very long conversations)
- Consider implementing message pagination for large histories
- API calls are made sequentially (not batched)

For production use with large datasets, consider:

1. **Context API or Redux** for global state management
2. **Database** for persisting conversation history
3. **Message Pagination** to load older messages on demand
4. **Request Debouncing** to prevent rapid API calls

## Future Enhancements

- 📎 File/image upload support
- 🎤 Voice input integration
- 💾 Conversation history persistence
- 🔍 Message search functionality
- 🌐 Multi-language support
- ⚙️ User preferences (theme, notification settings)
- 📊 Analytics tracking
- 🔐 Message encryption

## Backend Integration

Make sure your backend chatbot service:

1. Accepts POST requests with JSON bodies
2. Returns responses with `{ data: { reply: "..." } }` structure
3. Handles errors gracefully
4. Implements rate limiting if needed
5. Logs conversations for analytics

Example backend endpoint (pseudo-code):

```python
@app.route('/chatbot/ask', methods=['POST'])
def ask_chatbot():
    message = request.json.get('message')
    reply = generate_response(message)  # Your AI/ML logic here
    return jsonify({
        'data': {
            'reply': reply
        }
    })
```

## Support

For issues or questions about the chatbot implementation:
1. Check this documentation
2. Review the component source code in `components/Chatbot.tsx`
3. Test with the local API endpoint
4. Check Expo and React Native documentation

