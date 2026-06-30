import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api/v1";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const suggestions = [
  "How does QuickFleet work?",
  "How do I sign up as a rider?",
  "What are the payment options?",
];

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  chatWindow: {
    width: 320,
    maxHeight: 500,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  messagesContainer: {
    flex: 1,
    minHeight: 200,
  },
  messagesList: {
    padding: 12,
    gap: 8,
  },
  messageRow: {
    marginBottom: 8,
  },
  messageBubble: {
    maxWidth: "85%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: "flex-start",
    padding: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 6,
  },
  suggestionsScroll: {
    gap: 6,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: "#6b7280",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 14,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  chatButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm the QuickFleet assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const result = await response.json().catch(() => ({}));
      const reply = result?.data?.reply || "Sorry, I couldn't get a response right now.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Sorry, I couldn't reach the assistant service right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setOpen(true)} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>💬 Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const windowHeight = Platform.OS === "web" ? window.innerHeight : Dimensions.get("window").height;
  const chatbotHeight = Math.min(windowHeight * 0.7, 500);

  return (
    <View style={[styles.container, { zIndex: 50 }]}>
      <View style={[styles.chatWindow, { maxHeight: chatbotHeight }]}>
        {/* Header */}
        <LinearGradient colors={["#2563eb", "#1d4ed8"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>QuickFleet Assistant</Text>
              <Text style={styles.headerSubtitle}>Online now</Text>
            </View>
            <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.messagesContainer}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  {
                    flexDirection: message.role === "user" ? "row-reverse" : "row",
                  },
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    {
                      backgroundColor: message.role === "assistant" ? "#f3f4f6" : "#2563eb",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color: message.role === "assistant" ? "#1f2937" : "#fff",
                      },
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </View>
            ))}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2563eb" />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Suggestions */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                onPress={() => setInput(suggestion)}
                style={styles.suggestionButton}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading || !input.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor: loading || !input.trim() ? "#d1d5db" : "#2563eb",
              },
            ]}
          >
            <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
