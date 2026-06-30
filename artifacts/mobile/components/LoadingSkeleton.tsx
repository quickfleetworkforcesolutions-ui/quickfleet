import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SkeletonBoxProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonBoxProps) {
  const colors = useColors();
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.muted,
          opacity: anim,
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <SkeletonBox height={160} borderRadius={8} style={{ marginBottom: 12 }} />
      <SkeletonBox height={18} width="70%" style={{ marginBottom: 8 }} />
      <SkeletonBox height={14} width="90%" style={{ marginBottom: 6 }} />
      <SkeletonBox height={14} width="60%" />
    </View>
  );
}

export function ListItemSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.listItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <SkeletonBox height={20} width="60%" style={{ marginBottom: 8 }} />
      <SkeletonBox height={14} width="40%" style={{ marginBottom: 6 }} />
      <SkeletonBox height={14} width="80%" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  listItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
});
