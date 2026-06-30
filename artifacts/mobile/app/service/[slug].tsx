import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { cachedFetch } from "@/lib/api";
import type { Service } from "@/lib/types";
import { useColors } from "@/hooks/useColors";

export default function ServiceDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => cachedFetch<Service>(`/services/${slug}`, `service-${slug}`),
    enabled: !!slug,
  });

  const svc = data?.data;
  const features = svc?.features
    ? svc.features
        .split(/[;\n]/)
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <Stack.Screen options={{ title: svc?.title ?? "Service", headerTransparent: true }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : isError || !svc ? (
          <View style={styles.errorView}>
            <Feather name="alert-circle" size={40} color={colors.muted} />
            <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
              Unable to load service details.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 40,
            }}
          >
            {/* Hero Image */}
            <View style={styles.heroWrap}>
              {svc.bannerImageUrl ? (
                <Image
                  source={{ uri: svc.bannerImageUrl }}
                  style={styles.heroImage}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.heroImage, { backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }]}>
                  <Feather name="briefcase" size={64} color={colors.primary} />
                </View>
              )}
              <LinearGradient
                colors={["transparent", "rgba(6,18,43,0.85)"]}
                style={styles.heroGradient}
              />
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>{svc.title}</Text>
              </View>
            </View>

            <View style={{ padding: 20 }}>
              {/* Summary */}
              {svc.summary ? (
                <Text style={[styles.summary, { color: colors.mutedForeground }]}>
                  {svc.summary}
                </Text>
              ) : null}

              {/* Description */}
              {svc.description ? (
                <>
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>
                    Overview
                  </Text>
                  <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>
                    {svc.description}
                  </Text>
                </>
              ) : null}

              {/* Features */}
              {features.length > 0 ? (
                <>
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>
                    What's Included
                  </Text>
                  {features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <View style={[styles.featureDot, { backgroundColor: colors.primary }]}>
                        <Feather name="check" size={12} color="#FFF" />
                      </View>
                      <Text style={[styles.featureText, { color: colors.text }]}>
                        {f}
                      </Text>
                    </View>
                  ))}
                </>
              ) : null}

              {/* CTA */}
              <Pressable
                style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/(tabs)/contact")}
              >
                <Text style={styles.ctaText}>Request a Quote</Text>
                <Feather name="arrow-right" size={16} color="#FFF" />
              </Pressable>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heroWrap: { position: "relative" },
  heroImage: { width: "100%", height: 280 },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    top: "40%",
  },
  heroTextWrap: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  summary: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 14,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  featureDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  featureText: { fontSize: 15, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 24 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  ctaText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  errorView: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
