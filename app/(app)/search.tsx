import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { fetchTracks } from "../../api/itunesApi";
import TrackCard from "../../components/TrackCard";
import { Track } from "../../types";

import { Colors, getCommonStyles } from "../../constants/Styles";
import { addQuery, clearQueries, removeQuery } from "../../store/historySlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const recentSearches = useAppSelector((state) => state.history.queries);
  const netInfo = useNetInfo();

  // ─── Dynamic Theme Setup ───
  const theme = useColorScheme() ?? 'dark';
  const colors = Colors[theme];
  const commonStyles = getCommonStyles(colors);
  const styles = getStyles(colors, commonStyles);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const getSearchResults = async () => {
      if (debouncedQuery.trim() === "") {
        setFilteredData([]);
        return;
      }
      if (netInfo.isConnected === false) {
        setFilteredData([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      dispatch(addQuery(debouncedQuery));
      try {
        const results = await fetchTracks(debouncedQuery);
        setFilteredData(results);
      } finally {
        setIsLoading(false);
      }
    };
    getSearchResults();
  }, [debouncedQuery, netInfo.isConnected]);

  return (
    <>
      <CustomHeader title="Search" />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Songs, artists, albums…"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textTertiary}
              selectionColor={colors.accent}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {searchQuery.trim() === "" && recentSearches.length > 0 ? (
          <View style={styles.recentContainer}>
            <View style={styles.recentHeaderRow}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={() => dispatch(clearQueries())} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipsContainer}>
              {recentSearches.map((term, index) => (
                <View key={index} style={styles.chipContainer}>
                  <TouchableOpacity
                    style={styles.chipClickable}
                    onPress={() => setSearchQuery(term)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="time-outline" size={14} color={colors.accent} style={styles.chipIcon} />
                    <Text style={styles.chipText}>{term}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.chipDeleteIcon}
                    onPress={() => dispatch(removeQuery(term))}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Searching iTunes…</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.trackId.toString()}
            renderItem={({ item }) => <TrackCard track={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              debouncedQuery !== "" ? (
                netInfo.isConnected === false ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="cloud-offline" size={48} color={colors.textTertiary} />
                    <Text style={styles.emptyText}>You're offline — connect to search.</Text>
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="musical-notes-outline" size={48} color={colors.textTertiary} />
                    <Text style={styles.emptyText}>No results for "{debouncedQuery}"</Text>
                  </View>
                )
              ) : null
            }
          />
        )}
      </View>
    </>
  );
}

const getStyles = (colors: typeof Colors.light, commonStyles: any) => StyleSheet.create({
  container: {
    ...commonStyles.screenContainer,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    ...commonStyles.emptyContainer,
  },
  emptyText: {
    ...commonStyles.emptyText,
  },
  loadingContainer: {
    ...commonStyles.loadingContainer,
  },
  loadingText: {
    ...commonStyles.loadingText,
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  recentTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textTertiary,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: 6,
  },
  chipClickable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 6,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  chipDeleteIcon: {
    padding: 4,
    borderRadius: 10,
  },
});