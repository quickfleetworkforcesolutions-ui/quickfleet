import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { NetworkBanner } from "@/components/NetworkBanner";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { pagedFetch } from "@/lib/api";
import { FALLBACK_SERVICES } from "@/lib/fallback";
import type { Service } from "@/lib/types";
import { useColors } from "@/hooks/useColors";

export default function ServicesScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: () =>
      pagedFetch<Service>(
        "/services/admin?status=PUBLISHED&page=0&size=50",
        "services"
      ),
  });

  const services = data?.data?.length ? data.data : FALLBACK_SERVICES;
  const fromCache = data?.fromCache ?? false;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NetworkBanner visible={fromCache} />
      {isLoading ? (
        <View style={{ padding: 16, paddingTop: topPad + 16 }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{
            padding: 16,
            paddingTop: topPad + 16,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              <Text style={[styles.pageTitle, { color: colors.text }]}>
                Our Services
              </Text>
              <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
                End-to-end solutions for growing businesses
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="briefcase" size={40} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No services available
              </Text>
            </View>
          }
          renderItem={({ item: svc }) => (
            <Pressable
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => router.push(`/service/${svc.slug}`)}
            >
              {svc.bannerImageUrl ? (
                <Image
                  source={{ uri: svc.bannerImageUrl }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.cardImagePlaceholder,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Feather name="briefcase" size={36} color={colors.primary} />
                </View>
              )}
              <View style={styles.cardBody}>
                <View style={styles.cardRow}>
                  <Text
                    style={[styles.cardTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {svc.title}
                  </Text>
                  {svc.featured ? (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: "#FEF3C7" },
                      ]}
                    >
                      <Text style={styles.badgeText}>Featured</Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  style={[styles.cardSummary, { color: colors.mutedForeground }]}
                  numberOfLines={3}
                >
                  {svc.summary}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={[styles.viewMore, { color: colors.primary }]}>
                    View details
                  </Text>
                  <Feather name="arrow-right" size={15} color={colors.primary} />
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: { width: "100%", height: 180 },
  cardImagePlaceholder: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { padding: 16 },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: "#92400E",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  cardSummary: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 14,
  },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 4 },
  viewMore: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
