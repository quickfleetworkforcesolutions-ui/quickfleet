import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import { z } from "zod";

import { postFormData } from "@/lib/api";
import { useColors } from "@/hooks/useColors";

const applySchema = z.object({
  candidateName: z.string().min(2, "Name must be at least 2 characters"),
  candidateEmail: z.string().email("Enter a valid email address"),
  candidatePhone: z
    .string()
    .regex(/^\d{7,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  experience: z.string().min(1, "Please enter your experience"),
});

export default function ApplyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [form, setForm] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    experience: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState<{
    name: string;
    uri: string;
    mimeType: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      setResume({
        name: asset.name,
        uri: asset.uri,
        mimeType: asset.mimeType ?? "application/octet-stream",
      });
      if (errors.resume) setErrors((e) => ({ ...e, resume: "" }));
    } catch {
      Alert.alert("Error", "Unable to pick file. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const validation = applySchema.safeParse(form);
    const errs: Record<string, string> = {};

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
    }
    if (!resume) errs.resume = "Please upload your resume (PDF or Word)";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("jobSlug", slug ?? "");
      fd.append("candidateName", form.candidateName.trim());
      fd.append("candidateEmail", form.candidateEmail.trim());
      if (form.candidatePhone) fd.append("candidatePhone", form.candidatePhone.trim());
      fd.append("coverLetter", `Experience: ${form.experience} years\n${form.coverLetter}`.trim());
      fd.append("resume", {
        uri: resume!.uri,
        name: resume!.name,
        type: resume!.mimeType,
      } as unknown as Blob);

      await postFormData("/careers/applications", fd);
      Alert.alert(
        "Application Submitted",
        "HR will contact you shortly.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch {
      Alert.alert("Submission Failed", "Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Apply for Job" }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 40,
            }}
          >
            <Text style={[styles.pageTitle, { color: colors.text }]}>
              Job Application
            </Text>
            <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
              Fill in your details to apply
            </Text>

            <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
            <TextInput
              style={[styles.input, { borderColor: errors.candidateName ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
              placeholder="Your full name"
              placeholderTextColor={colors.mutedForeground}
              value={form.candidateName}
              onChangeText={(v) => set("candidateName", v)}
            />
            {errors.candidateName ? <Text style={styles.err}>{errors.candidateName}</Text> : null}

            <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
            <TextInput
              style={[styles.input, { borderColor: errors.candidateEmail ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
              placeholder="your@email.com"
              placeholderTextColor={colors.mutedForeground}
              value={form.candidateEmail}
              onChangeText={(v) => set("candidateEmail", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.candidateEmail ? <Text style={styles.err}>{errors.candidateEmail}</Text> : null}

            <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
            <TextInput
              style={[styles.input, { borderColor: errors.candidatePhone ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
              placeholder="Mobile number"
              placeholderTextColor={colors.mutedForeground}
              value={form.candidatePhone}
              onChangeText={(v) => set("candidatePhone", v)}
              keyboardType="phone-pad"
            />
            {errors.candidatePhone ? <Text style={styles.err}>{errors.candidatePhone}</Text> : null}

            <Text style={[styles.label, { color: colors.text }]}>Years of Experience *</Text>
            <TextInput
              style={[styles.input, { borderColor: errors.experience ? "#EF4444" : colors.input, color: colors.text, backgroundColor: colors.card }]}
              placeholder="e.g. 3"
              placeholderTextColor={colors.mutedForeground}
              value={form.experience}
              onChangeText={(v) => set("experience", v)}
              keyboardType="numeric"
            />
            {errors.experience ? <Text style={styles.err}>{errors.experience}</Text> : null}

            <Text style={[styles.label, { color: colors.text }]}>Cover Letter (optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea, { borderColor: colors.input, color: colors.text, backgroundColor: colors.card }]}
              placeholder="Briefly describe why you're a great fit..."
              placeholderTextColor={colors.mutedForeground}
              value={form.coverLetter}
              onChangeText={(v) => set("coverLetter", v)}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.label, { color: colors.text }]}>Resume *</Text>
            <Pressable
              style={[
                styles.uploadBtn,
                {
                  borderColor: errors.resume ? "#EF4444" : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              onPress={pickResume}
            >
              <Feather
                name={resume ? "file-text" : "upload"}
                size={20}
                color={resume ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.uploadText,
                  { color: resume ? colors.primary : colors.mutedForeground },
                ]}
                numberOfLines={1}
              >
                {resume ? resume.name : "Upload Resume (PDF / Word)"}
              </Text>
            </Pressable>
            {errors.resume ? <Text style={styles.err}>{errors.resume}</Text> : null}

            <Pressable
              style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.submitText}>Submit Application</Text>
                  <Feather name="send" size={16} color="#FFF" />
                </>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 24 },
  label: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 6, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  textarea: { height: 110 },
  err: { color: "#EF4444", fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 8, marginLeft: 2 },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 16,
    marginBottom: 4,
  },
  uploadText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  submitText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
