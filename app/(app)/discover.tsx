import CustomHeader from "@/components/CustomHeader";
import { useNetInfo } from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { fetchTracks } from "../../api/itunesApi";
import TrackCard from "../../components/TrackCard";
import { Colors, getCommonStyles } from "../../constants/Styles";
import { addTrack } from "../../store/historySlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Track } from "../../types";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width * 0.85;

export default function DiscoverScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [topAlbums, setTopAlbums] = useState<Track[]>([]);
  const [topSongs, setTopSongs] = useState<Track[]>([]);

  const recentTracks = useAppSelector((state) => state.history.tracks);
  const favoriteTracks = useAppSelector((state) => state.favorites.items).slice(0, 5);

  const netInfo = useNetInfo();

  // ─── Dynamic Theme Setup ───
  const theme = useColorScheme() ?? 'dark';
  const colors = Colors[theme];
  const commonStyles = getCommonStyles(colors);
  const styles = getStyles(colors, commonStyles);

  useEffect(() => {
    const loadDiscoverData = async () => {
      setIsLoading(true);
      if (netInfo.isConnected === false) {
        setIsLoading(false);
        return;
      }
      try {
        const [trending, albums, songs] = await Promise.all([
          fetchTracks("Top Hits"),
          fetchTracks("Best Albums"),
          fetchTracks("Global Top 50"),
        ]);
        setTrendingTracks(trending);
        setTopAlbums(albums);
        setTopSongs(songs);
      } catch (error) {
        console.error("Failed to fetch discover data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDiscoverData();
  }, [netInfo.isConnected]);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Curating your feed…</Text>
      </View>
    );
  }

  const groupedTracks: Track[][] = [];
  for (let i = 0; i < trendingTracks.length; i += 2) {
    groupedTracks.push(trendingTracks.slice(i, i + 2));
  }

  const renderSmallCardList = (data: Track[]) => (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${item.trackId}-${index}`}
      nestedScrollEnabled={true}
      contentContainerStyle={styles.smallCardListContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.smallCard}
          activeOpacity={0.7}
          onPress={() => {
            dispatch(addTrack(item));
            router.push({
              pathname: "/track/[id]",
              params: {
                id: item.trackId,
                trackName: item.trackName,
                artistName: item.artistName,
                artworkUrl: item.artworkUrl100.replace("100x100", "300x300"),
                previewUrl: item.previewUrl,
              },
            });
          }}
        >
          <Image source={{ uri: item.artworkUrl100 }} style={styles.smallArtwork} />
          <Text style={styles.smallTrackName} numberOfLines={1}>
            {item.trackName}
          </Text>
          <Text style={styles.smallArtistName} numberOfLines={1}>
            {item.artistName}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <>
      <CustomHeader title="Discover" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── TRENDING HERO ── */}
        <View style={styles.heroHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <Text style={styles.sectionSubtitle}>Curated for you today</Text>
        </View>

        <FlatList
          data={groupedTracks}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          snapToInterval={PAGE_WIDTH + 12}
          decelerationRate="fast"
          contentContainerStyle={styles.heroListContent}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <View style={[styles.page, { width: PAGE_WIDTH }]}>
              {item.map((track) => (
                <TrackCard key={track.trackId} track={track} />
              ))}
            </View>
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / (PAGE_WIDTH + 12)
            );
            setActiveIndex(index);
          }}
        />

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {groupedTracks.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ── RECENTLY VIEWED ── */}
        {recentTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            {renderSmallCardList(recentTracks)}
          </View>
        )}

        {/* ── TOP ALBUMS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Albums</Text>
          {renderSmallCardList(topAlbums)}
        </View>

        {/* ── GLOBAL TOP SONGS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Global Top Songs</Text>
          {renderSmallCardList(topSongs)}
        </View>

        {/* ── YOUR FAVORITES ── */}
        {favoriteTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Favorites</Text>
            <View style={styles.favoriteList}>
              {favoriteTracks.map((track) => (
                <TrackCard key={`fav-${track.trackId}`} track={track} />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </>
  );
}

const getStyles = (colors: typeof Colors.light, commonStyles: any) => StyleSheet.create({
  container: {
    ...commonStyles.screenContainer,
    paddingTop: 8,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  heroHeader: {
    paddingTop: 20,
    marginBottom: 10,
  },
  heroListContent: {
    paddingHorizontal: 20,
  },
  page: {
    marginRight: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: colors.accent,
    width: 22,
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    ...commonStyles.sectionTitle,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  smallCardListContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 10,
    paddingTop: 10,
  },
  smallCard: {
    ...commonStyles.smallCard,
  },
  smallArtwork: {
    ...commonStyles.smallArtwork,
  },
  smallTrackName: {
    ...commonStyles.smallTrackName,
  },
  smallArtistName: {
    ...commonStyles.smallArtistName,
  },
  favoriteList: {
    paddingHorizontal: 20,
    gap: 1,
  },
});