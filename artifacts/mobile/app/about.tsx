import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NetworkBanner } from "@/components/NetworkBanner";
import { cachedFetch } from "@/lib/api";
import { findSection } from "@/lib/cms";
import type { CmsPage } from "@/lib/types";
import { useColors } from "@/hooks/useColors";
import { Stack } from "expo-router";

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ["cms-about"],
    queryFn: () => cachedFetch<CmsPage>("/cms/pages/about", "cms-about"),
  });

  const page = data?.data;
  const sections = page?.sections ?? [];
  const fromCache = data?.fromCache ?? false;

  const aboutSection = findSection(sections, "ABOUT");
  const missionSection = findSection(sections, "MISSION");
  const visionSection = findSection(sections, "VISION");

  const fallbackAbout =
    "QuickFleet Workforce Solutions is a leading B2B company providing end-to-end workforce supply, IT infrastructure support, and CCTV/security services across India.";
  const fallbackMission =
    "To be India's most trusted workforce partner, delivering skilled, compliant, and efficient human resource solutions that empower businesses to grow.";
  const fallbackVision =
    "To reach 1 million placements and serve businesses across every major Indian city, setting the benchmark for workforce quality and client satisfaction.";

  return (
    <>
      <Stack.Screen options={{ title: "About Us" }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <NetworkBanner visible={fromCache} />
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 40,
            }}
          >
            {/* About */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.badge, { backgroundColor: "#EFF6FF" }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>ABOUT US</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {aboutSection?.heading ?? "About QuickFleet"}
              </Text>
              <Text style={[styles.body, { color: colors.mutedForeground }]}>
                {aboutSection?.body ?? fallbackAbout}
              </Text>
            </View>

            {/* Mission */}
            <View style={[styles.section, { backgroundColor: "#06122b", borderColor: "#1a2f4a" }]}>
              <View style={[styles.badge, { backgroundColor: "rgba(245,158,11,0.2)" }]}>
                <Text style={[styles.badgeText, { color: "#F59E0B" }]}>OUR MISSION</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: "#FFFFFF" }]}>
                {missionSection?.heading ?? "Our Mission"}
              </Text>
              <Text style={[styles.body, { color: "rgba(255,255,255,0.75)" }]}>
                {missionSection?.body ?? fallbackMission}
              </Text>
            </View>

            {/* Vision */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.badge, { backgroundColor: "#ECFDF5" }]}>
                <Text style={[styles.badgeText, { color: "#059669" }]}>OUR VISION</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {visionSection?.heading ?? "Our Vision"}
              </Text>
              <Text style={[styles.body, { color: colors.mutedForeground }]}>
                {visionSection?.body ?? fallbackVision}
              </Text>
            </View>

            {/* Stats */}
            <View style={[styles.statsGrid, { backgroundColor: colors.primary }]}>
              {[
                { value: "12,000+", label: "Workforce Deployed" },
                { value: "350+", label: "Business Clients" },
                { value: "1,200+", label: "Service Requests" },
                { value: "98%", label: "Satisfaction Rate" },
              ].map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 12 },
  body: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 26 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
  },
  statItem: {
    width: "50%",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  statValue: { color: "#FFF", fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 4 },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
});
