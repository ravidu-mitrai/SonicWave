import { Ionicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function NetworkStatus() {
  // This hook constantly listens to the phone's hardware network state
  const netInfo = useNetInfo();

  // If we are online, or if the hook is still figuring it out (null), render nothing!
  if (netInfo.isConnected !== false) {
    return null;
  }

  // If we hit this point, the user is officially OFFLINE. Show the banner.
  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline" size={16} color="#fff" />
      <Text style={styles.text}>No Internet Connection - Offline Mode</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    gap: 8,
    zIndex: 100,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
