import CustomHeader from '../../components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native';
import TrackCard from '../../components/TrackCard';
import { Colors, getCommonStyles } from '../../constants/Styles';
import { useAppSelector } from '../../store/hooks';

export default function FavoritesScreen() {
  const favoriteTracks = useAppSelector((state) => state.favorites.items);

  // ─── Dynamic Theme Setup ───
  const theme = useColorScheme() ?? 'dark';
  const colors = Colors[theme];
  const commonStyles = getCommonStyles(colors);
  const styles = getStyles(colors, commonStyles);

  return (
    <>
      <CustomHeader title="Favorites" />
      <View style={styles.container}>
        <FlatList
          data={favoriteTracks}
          keyExtractor={(item) => item.trackId.toString()}
          renderItem={({ item }) => <TrackCard track={item} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            favoriteTracks.length > 0 ? (
              <View style={styles.listHeader}>
                <Text style={styles.countLabel}>
                  {favoriteTracks.length} {favoriteTracks.length === 1 ? "Track" : "Tracks"}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="heart-outline" size={36} color={colors.accent} />
              </View>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyText}>
                Tracks you love will appear here.{"\n"}Start exploring to build your collection.
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const getStyles = (colors: typeof Colors.light, commonStyles: any) => StyleSheet.create({
  container: {
    ...commonStyles.screenContainer,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  listHeader: {
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 4,
  },
  countLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.accentMuted,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    letterSpacing: 0.1,
  },
});