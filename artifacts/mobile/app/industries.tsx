import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { cachedFetch } from "@/lib/api";
import { getIndustries } from "@/lib/cms";
import { FALLBACK_INDUSTRIES } from "@/lib/fallback";
import type { CmsPage, IndustryItem } from "@/lib/types";
import { useColors } from "@/hooks/useColors";

const ICON_COLORS = [
  { bg: "#EFF6FF", icon: "#0B5ED7" },
  { bg: "#ECFDF5", icon: "#059669" },
  { bg: "#FEF3C7", icon: "#D97706" },
  { bg: "#FDF2F8", icon: "#9333EA" },
  { bg: "#FFF7ED", icon: "#EA580C" },
  { bg: "#F0FDF4", icon: "#16A34A" },
  { bg: "#EFF6FF", icon: "#2563EB" },
  { bg: "#FFF1F2", icon: "#E11D48" },
];

export default function IndustriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ["cms-home-industries"],
    queryFn: () => cachedFetch<CmsPage>("/cms/pages/home", "cms-home"),
  });

  const industries: IndustryItem[] = data?.data
    ? getIndustries(data.data.sections ?? [])
    : [];

  const displayIndustries =
    industries.filter((i) => i.visible !== false).length > 0
      ? industries.filter((i) => i.visible !== false)
      : FALLBACK_INDUSTRIES;

  return (
    <>
      <Stack.Screen options={{ title: "Industries We Serve" }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={displayIndustries}
            numColumns={2}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 40,
            }}
            columnWrapperStyle={{ gap: 12 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListHeaderComponent={
              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.pageTitle, { color: colors.text }]}>
                  Industries We Serve
                </Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  Trusted workforce solutions across diverse sectors
                </Text>
              </View>
            }
            renderItem={({ item: ind, index }) => {
              const palette = ICON_COLORS[index % ICON_COLORS.length];
              return (
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      flex: 1,
                    },
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: palette.bg }]}>
                    <Feather
                      name={(ind.icon as any) ?? "briefcase"}
                      size={24}
                      color={palette.icon}
                    />
                  </View>
                  <Text style={[styles.indName, { color: colors.text }]}>
                    {ind.name}
                  </Text>
                  {ind.description ? (
                    <Text
                      style={[styles.indDesc, { color: colors.mutedForeground }]}
                      numberOfLines={2}
                    >
                      {ind.description}
                    </Text>
                  ) : null}
                </View>
              );
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  indName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  indDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
