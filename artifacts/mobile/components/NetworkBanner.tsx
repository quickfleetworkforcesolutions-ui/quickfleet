import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  message?: string;
}

export function NetworkBanner({
  visible,
  message = "Showing saved content — unable to reach server.",
}: Props) {
  if (!visible) return null;
  return (
    <View style={styles.banner}>
      <Feather name="wifi-off" size={14} color="#92400E" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  text: {
    fontSize: 12,
    color: "#92400E",
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
});
