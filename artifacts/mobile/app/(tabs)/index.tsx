import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { NetworkBanner } from "@/components/NetworkBanner";
import { SkeletonBox, CardSkeleton } from "@/components/LoadingSkeleton";
import { useSettings } from "@/context/SettingsContext";
import { cachedFetch, pagedFetch } from "@/lib/api";
import { findSection, parseStats, getWhyChoose, getIndustries } from "@/lib/cms";
import {
  FALLBACK_HOME_PAGE,
  FALLBACK_STATS,
  FALLBACK_SERVICES,
  FALLBACK_WHY_CHOOSE,
} from "@/lib/fallback";
import type { CmsPage, Service, Testimonial } from "@/lib/types";
import { useColors } from "@/hooks/useColors";

const TRUST_BADGES = [
  { icon: "map-pin", label: "PAN India Service" },
  { icon: "zap", label: "Rapid Response" },
  { icon: "award", label: "Skilled Professionals" },
  { icon: "trending-down", label: "Cost Effective" },
];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const [refreshing, setRefreshing] = useState(false);

  const homeQuery = useQuery({
    queryKey: ["cms-home"],
    queryFn: () => cachedFetch<CmsPage>("/cms/pages/home", "cms-home"),
  });

  const testimonialsQuery = useQuery({
    queryKey: ["testimonials"],
    queryFn: () =>
      pagedFetch<Testimonial>("/testimonial?page=0&size=20", "testimonials"),
  });

  const servicesQuery = useQuery({
    queryKey: ["services-preview"],
    queryFn: () =>
      pagedFetch<Service>(
        "/services/admin?status=PUBLISHED&page=0&size=3",
        "services-preview"
      ),
  });

  const fromCache =
    (homeQuery.data?.fromCache ?? false) ||
    (servicesQuery.data?.fromCache ?? false);

  const page = homeQuery.data?.data ?? FALLBACK_HOME_PAGE;
  const sections = page.sections ?? [];
  const heroSection = findSection(sections, "HERO");
  const statsSection = findSection(sections, "STATS");
  const aboutSection = findSection(sections, "ABOUT");
  const stats =
    parseStats(statsSection).length > 0
      ? parseStats(statsSection)
      : FALLBACK_STATS;
  const whyChoose = getWhyChoose(sections);
  const services =
    servicesQuery.data?.data?.length ? servicesQuery.data.data : FALLBACK_SERVICES;
  const testimonials = (testimonialsQuery.data?.data ?? []).filter(
    (t) => t.visible !== false
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      homeQuery.refetch(),
      testimonialsQuery.refetch(),
      servicesQuery.refetch(),
    ]);
    setRefreshing(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NetworkBanner visible={fromCache} />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* HERO */}
        <View style={[styles.hero, { paddingTop: topPad + 20 }]}>
          <LinearGradient
            colors={["#06122b", "#0a1530", "#0B5ED7"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          {heroSection?.backgroundImageUrl || heroSection?.imageUrl ? (
            <Image
              source={{ uri: heroSection.backgroundImageUrl ?? heroSection.imageUrl }}
              style={[StyleSheet.absoluteFill, { opacity: 0.2 }]}
              contentFit="cover"
            />
          ) : null}
          <View style={styles.heroContent}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoQ}>Q</Text>
            </View>
            <Text style={styles.heroHeading}>
              {heroSection?.heading ?? "Reliable Workforce & Technical Solutions"}
            </Text>
            <Text style={styles.heroSub}>
              {heroSection?.subheading ?? settings.tagline ?? "for Growing Businesses"}
            </Text>
            <Pressable
              style={styles.heroCta}
              onPress={() => router.push("/(tabs)/contact")}
            >
              <Text style={styles.heroCtaText}>
                {heroSection?.buttonLabel ?? "Request a Free Quote"}
              </Text>
              <Feather name="arrow-right" size={16} color="#06122b" />
            </Pressable>
          </View>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            {TRUST_BADGES.map((b) => (
              <View key={b.label} style={styles.trustBadge}>
                <Feather name={b.icon as any} size={14} color="#F59E0B" />
                <Text style={styles.trustText}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* STATS */}
        <View style={[styles.statsRow, { backgroundColor: colors.primary }]}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ABOUT PREVIEW */}
        {aboutSection ? (
          <View style={[styles.section, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {aboutSection.heading ?? "About QuickFleet"}
            </Text>
            <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>
              {aboutSection.body?.slice(0, 200)}
              {(aboutSection.body?.length ?? 0) > 200 ? "..." : ""}
            </Text>
            <Pressable
              style={styles.linkBtn}
              onPress={() => router.push("/about")}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Read more
              </Text>
              <Feather name="chevron-right" size={16} color={colors.primary} />
            </Pressable>
          </View>
        ) : null}

        {/* SERVICES PREVIEW */}
        <View style={[styles.section, { backgroundColor: "#F8FAFC" }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Our Services
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/services")}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                View all
              </Text>
            </Pressable>
          </View>
          {servicesQuery.isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            services.slice(0, 3).map((svc) => (
              <Pressable
                key={svc.id}
                style={[
                  styles.serviceCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => router.push(`/service/${svc.slug}`)}
              >
                {svc.bannerImageUrl ? (
                  <Image
                    source={{ uri: svc.bannerImageUrl }}
                    style={styles.serviceImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.serviceImagePlaceholder, { backgroundColor: colors.secondary }]}>
                    <Feather name="briefcase" size={32} color={colors.primary} />
                  </View>
                )}
                <View style={styles.serviceCardBody}>
                  <Text style={[styles.serviceTitle, { color: colors.text }]}>
                    {svc.title}
                  </Text>
                  <Text style={[styles.serviceSummary, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {svc.summary}
                  </Text>
                  <View style={styles.serviceArrow}>
                    <Text style={[styles.linkText, { color: colors.primary }]}>
                      Learn more
                    </Text>
                    <Feather name="arrow-right" size={14} color={colors.primary} />
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* WHY CHOOSE US */}
        {(whyChoose.length > 0 ? whyChoose : FALLBACK_WHY_CHOOSE).length > 0 ? (
          <View style={[styles.section, { backgroundColor: colors.dark }]}>
            <Text style={[styles.sectionTitle, { color: "#FFFFFF" }]}>
              Why Choose QuickFleet
            </Text>
            <View style={styles.whyGrid}>
              {(whyChoose.length > 0 ? whyChoose : FALLBACK_WHY_CHOOSE).map((item) => (
                <View key={item.id} style={[styles.whyCard, { backgroundColor: "rgba(255,255,255,0.08)" }]}>
                  <View style={styles.whyIcon}>
                    <Feather name={(item.icon as any) ?? "check-circle"} size={22} color="#F59E0B" />
                  </View>
                  <Text style={styles.whyTitle}>{item.title}</Text>
                  <Text style={styles.whyDesc}>{item.description}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* TESTIMONIALS */}
        {testimonials.length > 0 ? (
          <View style={[styles.section, { backgroundColor: "#F8FAFC" }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What Clients Say
            </Text>
            <FlatList
              data={testimonials}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(t) => t.id}
              contentContainerStyle={{ gap: 12, paddingRight: 16 }}
              renderItem={({ item: t }) => (
                <View style={[styles.testimonialCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="message-circle" size={20} color={colors.primary} style={{ marginBottom: 8 }} />
                  <Text style={[styles.testimonialText, { color: colors.text }]} numberOfLines={4}>
                    "{t.testimonialText}"
                  </Text>
                  <Text style={[styles.testimonialName, { color: colors.primary }]}>
                    {t.clientName}
                  </Text>
                  {t.clientTitle || t.clientCompany ? (
                    <Text style={[styles.testimonialRole, { color: colors.mutedForeground }]}>
                      {[t.clientTitle, t.clientCompany].filter(Boolean).join(", ")}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>
        ) : null}

        {/* CTA BANNER */}
        <View style={styles.ctaBanner}>
          <LinearGradient
            colors={["#F59E0B", "#D97706"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Text style={styles.ctaTitle}>Ready to Scale Your Business?</Text>
          <Text style={styles.ctaSub}>
            Get a customized workforce solution within 24 hours.
          </Text>
          <Pressable
            style={styles.ctaBtn}
            onPress={() => router.push("/(tabs)/contact")}
          >
            <Text style={styles.ctaBtnText}>Request a Quote</Text>
          </Pressable>
        </View>

        <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 420,
    paddingHorizontal: 20,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  heroContent: { marginTop: 20, marginBottom: 24 },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0B5ED7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoQ: { color: "#FFFFFF", fontSize: 26, fontFamily: "Inter_700Bold" },
  heroHeading: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    lineHeight: 36,
    marginBottom: 10,
  },
  heroSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 24,
  },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  heroCtaText: {
    color: "#06122b",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  trustRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  trustText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  section: { padding: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    marginBottom: 12,
  },
  linkBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  linkText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  serviceCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
  },
  serviceImage: { width: "100%", height: 160 },
  serviceImagePlaceholder: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceCardBody: { padding: 16 },
  serviceTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  serviceSummary: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 12,
  },
  serviceArrow: { flexDirection: "row", alignItems: "center", gap: 4 },
  whyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  whyCard: {
    width: "47%",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(245,158,11,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  whyTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  whyDesc: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  testimonialCard: {
    width: 280,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  testimonialText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 12,
    fontStyle: "italic",
  },
  testimonialName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  ctaBanner: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    overflow: "hidden",
    alignItems: "center",
  },
  ctaTitle: {
    color: "#06122b",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSub: {
    color: "#06122b",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
  ctaBtn: {
    backgroundColor: "#06122b",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  dark: { backgroundColor: "#06122b" },
});
