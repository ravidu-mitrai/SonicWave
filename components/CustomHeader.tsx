import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Styles'; // Updated import

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function CustomHeader({ title, showBack = false }: HeaderProps) {
  const router = useRouter();
  
  const theme = useColorScheme() ?? 'dark'; 
  const colors = Colors[theme];
  
  const styles = getStyles(colors);

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton} activeOpacity={0.7}>
          <View style={styles.backButtonInner}>
            <Ionicons name="chevron-back" size={12} color={colors.textPrimary} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

// Wrap styles in a function
const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButtonInner: {
    width: 26,
    height: 26,
    borderRadius: 17,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {},
  spacer: { width: 36 },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});