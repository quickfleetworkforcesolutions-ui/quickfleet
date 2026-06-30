import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { NetworkBanner } from "@/components/NetworkBanner";
import { useSettings } from "@/context/SettingsContext";
import { postJson, pagedFetch } from "@/lib/api";
import type { Service } from "@/lib/types";
import { useColors } from "@/hooks/useColors";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^\d{7,15}$/, "Enter a valid phone number (7-15 digits)"),
  subject: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings, fromCache } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "",
    city: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const servicesQuery = useQuery({
    queryKey: ["services-contact"],
    queryFn: () =>
      pagedFetch<Service>("/services/admin?status=PUBLISHED&page=0&size=50", "services"),
  });
  const services = servicesQuery.data?.data ?? [];

  const set = (key: keyof typeof form, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = async () => {
    const subject = form.service
      ? `${form.service}${form.city ? ` — ${form.city}` : ""}`
      : "General Inquiry";
    const companyNote = form.company ? `Company: ${form.company}\n` : "";
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      subject,
      message: `${companyNote}${form.message.trim()}`,
    };

    const result = inquirySchema.safeParse({
      name: payload.name,
      email: payload.email,
      phone: form.phone.trim(),
      subject,
      message: payload.message,
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        errs[field] = issue.message;
      }
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await postJson("/inquiries", payload);
      setForm({ name: "", company: "", phone: "", email: "", service: "", city: "", message: "" });
      Alert.alert(
        "Inquiry Received",
        "We'll respond within one business day.",
        [{ text: "OK" }]
      );
    } catch (err) {
      Alert.alert("Submission Failed", "Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const call = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  };
  const email = (addr: string) => Linking.openURL(`mailto:${addr}`);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NetworkBanner visible={fromCache} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingTop: topPad + 20,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100,
          }}
        >
          <Text style={[styles.pageTitle, { color: colors.text }]}>Contact Us</Text>
          <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
            Mon – Sat · 9:00 AM to 7:00 PM IST
          </Text>

          {/* Contact Info Cards */}
          {settings.address ? (
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.infoIcon, { backgroundColor: "#EFF6FF" }]}>
                <Feather name="map-pin" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.infoText, { color: colors.text }]}>
                {settings.address}
              </Text>
            </View>
          ) : null}

          {settings.contactPhone ? (
            <Pressable
              style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => call(settings.contactPhone!)}
            >
              <View style={[styles.infoIcon, { backgroundColor: "#ECFDF5" }]}>
                <Feather name="phone" size={18} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoText, { color: colors.primary }]}>
                  {settings.contactPhone}
                </Text>
                {settings.contactPhoneSecondary ? (
                  <Text style={[styles.infoText, { color: colors.primary }]}>
                    {settings.contactPhoneSecondary}
                  </Text>
                ) : null}
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ) : null}

          {settings.contactEmail ? (
            <Pressable
              style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => email(settings.contactEmail!)}
            >
              <View style={[styles.infoIcon, { backgroundColor: "#FFF7ED" }]}>
                <Feather name="mail" size={18} color="#EA580C" />
              </View>
              <Text style={[styles.infoText, { color: colors.primary }]}>
                {settings.contactEmail}
              </Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ) : null}

          {/* Inquiry Form */}
          <Text style={[styles.formTitle, { color: colors.text }]}>Send an Inquiry</Text>

          <TextInput
            style={[styles.input, { borderColor: errors.name ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
            placeholder="Full Name *"
            placeholderTextColor={colors.mutedForeground}
            value={form.name}
            onChangeText={(v) => set("name", v)}
          />
          {errors.name ? <Text style={styles.errText}>{errors.name}</Text> : null}

          <TextInput
            style={[styles.input, { borderColor: colors.input, color: colors.text, backgroundColor: colors.card }]}
            placeholder="Company (optional)"
            placeholderTextColor={colors.mutedForeground}
            value={form.company}
            onChangeText={(v) => set("company", v)}
          />

          <TextInput
            style={[styles.input, { borderColor: errors.phone ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
            placeholder="Phone *"
            placeholderTextColor={colors.mutedForeground}
            value={form.phone}
            onChangeText={(v) => set("phone", v)}
            keyboardType="phone-pad"
          />
          {errors.phone ? <Text style={styles.errText}>{errors.phone}</Text> : null}

          <TextInput
            style={[styles.input, { borderColor: errors.email ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
            placeholder="Email *"
            placeholderTextColor={colors.mutedForeground}
            value={form.email}
            onChangeText={(v) => set("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errText}>{errors.email}</Text> : null}

          {/* Service picker */}
          <View style={[styles.input, styles.pickerRow, { borderColor: errors.subject ? "#EF4444" : colors.input, backgroundColor: colors.card }]}>
            <Text style={{ color: form.service ? colors.text : colors.mutedForeground, flex: 1 }}>
              {form.service || "Service Required *"}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {services.map((s) => (
                <Pressable
                  key={s.id}
                  style={[
                    styles.svcChip,
                    {
                      backgroundColor:
                        form.service === s.title ? colors.primary : colors.muted,
                    },
                  ]}
                  onPress={() => set("service", s.title)}
                >
                  <Text style={{ color: form.service === s.title ? "#FFF" : colors.mutedForeground, fontSize: 13, fontFamily: "Inter_500Medium" }}>
                    {s.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          {errors.subject ? <Text style={styles.errText}>{errors.subject}</Text> : null}

          <TextInput
            style={[styles.input, { borderColor: colors.input, color: colors.text, backgroundColor: colors.card }]}
            placeholder="City"
            placeholderTextColor={colors.mutedForeground}
            value={form.city}
            onChangeText={(v) => set("city", v)}
          />

          <TextInput
            style={[styles.input, styles.textarea, { borderColor: errors.message ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
            placeholder="Your message *"
            placeholderTextColor={colors.mutedForeground}
            value={form.message}
            onChangeText={(v) => set("message", v)}
            multiline
            textAlignVertical="top"
          />
          {errors.message ? <Text style={styles.errText}>{errors.message}</Text> : null}

          <Pressable
            style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitText}>Send Inquiry</Text>
                <Feather name="send" size={16} color="#FFF" />
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 20 },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  formTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginTop: 24, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  textarea: { height: 110, marginBottom: 4 },
  pickerRow: { flexDirection: "row", alignItems: "center" },
  svcChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  errText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
    marginLeft: 4,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
