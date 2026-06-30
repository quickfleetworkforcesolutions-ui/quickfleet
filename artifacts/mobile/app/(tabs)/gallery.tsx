import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
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
import { SkeletonBox } from "@/components/LoadingSkeleton";
import { pagedFetch } from "@/lib/api";
import type { GalleryItem } from "@/lib/types";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["All", "HERO", "SERVICE", "TEAM", "EVENTS", "PORTFOLIO", "OTHER"];
const { width } = Dimensions.get("window");
const IMG_SIZE = (width - 48) / 2;

export default function GalleryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["gallery"],
    queryFn: () =>
      pagedFetch<GalleryItem>("/gallery?page=0&size=100", "gallery"),
  });

  const fromCache = data?.fromCache ?? false;
  const all = data?.data ?? [];
  const filtered =
    category === "All" ? all : all.filter((g) => g.category === category);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NetworkBanner visible={fromCache} />

      <View
        style={[
          styles.header,
          { paddingTop: topPad + 16, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.pageTitle, { color: colors.text }]}>Gallery</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    category === cat ? colors.primary : colors.muted,
                },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      category === cat
                        ? colors.primaryForeground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonBox
              key={i}
              width={IMG_SIZE}
              height={IMG_SIZE}
              borderRadius={12}
            />
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={(g) => g.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{
            padding: 16,
            gap: 12,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100,
          }}
          columnWrapperStyle={{ gap: 12 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="image" size={40} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No gallery images yet
              </Text>
            </View>
          }
          renderItem={({ item: g }) => (
            <Pressable onPress={() => setLightbox(g)}>
              <Image
                source={{ uri: g.imageUrl }}
                style={[
                  styles.gridImage,
                  { width: IMG_SIZE, height: IMG_SIZE },
                ]}
                contentFit="cover"
              />
            </Pressable>
          )}
        />
      )}

      {/* Lightbox */}
      <Modal
        visible={!!lightbox}
        transparent
        animationType="fade"
        onRequestClose={() => setLightbox(null)}
      >
        <Pressable style={styles.lightboxBg} onPress={() => setLightbox(null)}>
          <View style={styles.lightboxContent}>
            <Image
              source={{ uri: lightbox?.imageUrl }}
              style={styles.lightboxImage}
              contentFit="contain"
            />
            {lightbox?.title ? (
              <Text style={styles.lightboxTitle}>{lightbox.title}</Text>
            ) : null}
            <Pressable style={styles.lightboxClose} onPress={() => setLightbox(null)}>
              <Feather name="x" size={24} color="#FFF" />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  pageTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 12 },
  chips: { gap: 8, paddingBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 16,
  },
  gridImage: { borderRadius: 12 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  lightboxBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxContent: { width: "90%", alignItems: "center" },
  lightboxImage: { width: "100%", height: 400, borderRadius: 12 },
  lightboxTitle: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    marginTop: 12,
    textAlign: "center",
  },
  lightboxClose: {
    position: "absolute",
    top: -40,
    right: 0,
    padding: 8,
  },
});
