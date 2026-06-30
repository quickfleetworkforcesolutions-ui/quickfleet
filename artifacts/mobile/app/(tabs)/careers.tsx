import { Feather } from "@expo/vector-icons";
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
import { ListItemSkeleton } from "@/components/LoadingSkeleton";
import { pagedFetch } from "@/lib/api";
import type { Career } from "@/lib/types";
import { useColors } from "@/hooks/useColors";

export default function CareersScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["careers"],
    queryFn: () =>
      pagedFetch<Career>("/careers?visible=true&page=0&size=50", "careers"),
  });

  const jobs = (data?.data ?? []).filter((j) => j.visible !== false);
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
          {[1, 2, 3, 4].map((i) => (
            <ListItemSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j.id}
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
                Careers
              </Text>
              <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
                Join the QuickFleet team across India
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="users" size={40} color={colors.muted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Jobs Available
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Check back soon for new openings.
              </Text>
            </View>
          }
          renderItem={({ item: job }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardIcon}>
                  <Feather name="briefcase" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>
                    {job.title}
                  </Text>
                  {job.department ? (
                    <Text style={[styles.dept, { color: colors.mutedForeground }]}>
                      {job.department}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.metaRow}>
                {job.location ? (
                  <View style={styles.metaItem}>
                    <Feather name="map-pin" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                      {job.location}
                    </Text>
                  </View>
                ) : null}
                {job.employmentType ? (
                  <View style={styles.metaItem}>
                    <Feather name="clock" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                      {job.employmentType}
                    </Text>
                  </View>
                ) : null}
              </View>

              {job.summary ? (
                <Text
                  style={[styles.summary, { color: colors.mutedForeground }]}
                  numberOfLines={2}
                >
                  {job.summary}
                </Text>
              ) : null}

              <Pressable
                style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push(`/apply/${job.slug}`)}
              >
                <Text style={styles.applyBtnText}>Apply Now</Text>
                <Feather name="arrow-right" size={15} color="#FFF" />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 6 },
  pageSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: { flexDirection: "row", gap: 12, marginBottom: 12, alignItems: "flex-start" },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  jobTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  dept: { fontSize: 13, fontFamily: "Inter_400Regular" },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  summary: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 16 },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyBtnText: { color: "#FFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
