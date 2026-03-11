import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/Styles"; // Updated import

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
  themeColors: typeof Colors.light; // Pass colors down
}) {
  const styles = getStyles(props.themeColors);
  return (
    <View style={[styles.iconWrap, props.focused && styles.iconWrapActive]}>
      <FontAwesome name={props.name} size={19} color={props.color} />
    </View>
  );
}

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const tabBarPaddingBottom = Math.max(bottom, 8);
  const tabBarHeight = 46 + 14 + tabBarPaddingBottom;

  // Listen to OS theme
  const theme = useColorScheme() ?? 'dark';
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
          shadowColor: colors.accent,
          shadowOpacity: 0.10,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -3 },
          elevation: 16,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1.4,
          textTransform: "uppercase",
          marginTop: 2,
        },
        tabBarItemStyle: { paddingVertical: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} themeColors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="search" color={color} focused={focused} themeColors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="heart" color={color} focused={focused} themeColors={colors} />
          ),
        }}
      />
    </Tabs>
  );
}

const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  iconWrap: {
    width: 38,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.accentSoft,
    shadowColor: colors.accent,
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});