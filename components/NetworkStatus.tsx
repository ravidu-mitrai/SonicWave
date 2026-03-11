import { Ionicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import React from "react";
import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";
import { Colors } from "../constants/Styles";

export default function NetworkStatus() {
  // This hook constantly listens to the phone's hardware network state
  const netInfo = useNetInfo();

  const theme = useColorScheme() ?? 'dark';
  const colors = Colors[theme];
  const styles = getStyles(colors);

  // If we are online, or if the hook is still figuring it out (null), render nothing!
  if (netInfo.isConnected !== false) {
    return null;
  }

  // If we hit this point, the user is officially OFFLINE. Show the banner.
  return (
    <View style={styles.banner}>
      <View style={styles.iconWrap}>
        <Ionicons name="cloud-offline-outline" size={14} color={colors.textPrimary} />
      </View>
      <Text style={styles.text}>Offline Mode — No Internet Connection</Text>
    </View>
  );
}

const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.shimmer,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 75 : 24,
    gap: 8,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: colors.accentMuted,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
  },
});