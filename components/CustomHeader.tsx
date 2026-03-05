import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function CustomHeader({ title, showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={28} color="#f5f5f5" />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} /> 
      )}
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      {/* Spacer to keep the title perfectly centered */}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60, 
    paddingBottom: 16,
    backgroundColor: '#000000', 
  },
  iconButton: {
    padding: 4,
    color: '#f5f5f5',
  },
  spacer: {
    width: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f5f5f5',
  },
});