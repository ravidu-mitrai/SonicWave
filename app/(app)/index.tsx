import CustomHeader from "@/components/CustomHeader";
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
} from "react-native";
import { fetchTracks } from "../../api/itunesApi";
import TrackCard from "../../components/TrackCard";
import { Track } from "../../types";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width * 0.85;

export default function DiscoverScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveTracks, setLiveTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Fetch live data on mount
  useEffect(() => {
    const loadDiscoverData = async () => {
      setIsLoading(true);
      // Fetch some default trending data
      const data = await fetchTracks("Top Hits");
      setLiveTracks(data);
      setIsLoading(false);
    };

    loadDiscoverData();
  }, []);

  // Show full screen loader while the initial fetch happens
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text style={{ marginTop: 12, color: "#888" }}>
          Loading Discover...
        </Text>
      </View>
    );
  }

  // slice the LIVE data
  const groupedTracks: Track[][] = [];
  for (let i = 0; i < liveTracks.length; i += 2) {
    groupedTracks.push(liveTracks.slice(i, i + 2));
  }

  // just grab different slices of the live data for now to display the UI
  const recentTracks = liveTracks.slice(0, 4);
  const favoriteTracks = liveTracks.slice(4, 8); // this with Redux

  return (
    <>
      <CustomHeader title="Discover" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}> Discover </Text>
        <Text style={styles.subtitle}> Trending tracks for you </Text>

        <FlatList
          data={groupedTracks}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          snapToInterval={PAGE_WIDTH + 12}
          decelerationRate={"fast"}
          contentContainerStyle={{ paddingHorizontal: 20 }}
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
              e.nativeEvent.contentOffset.x / (PAGE_WIDTH + 12),
            );
            setActiveIndex(index);
          }}
        />

        <View style={styles.dotsContainer}>
          {groupedTracks.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Recently Searched</Text>
          <FlatList
            data={recentTracks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `recent-${item.trackId}`}
            nestedScrollEnabled={true}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.smallCard}
                activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    pathname: "/track/[id]",
                    params: {
                      id: item.trackId,
                      trackName: item.trackName,
                      artistName: item.artistName,
                      artworkUrl: item.artworkUrl100.replace(
                        "100x100",
                        "300x300",
                      ),
                      previewUrl: item.previewUrl,
                    },
                  });
                }}
              >
                <Image
                  source={{ uri: item.artworkUrl100 }}
                  style={styles.smallArtwork}
                />
                <Text style={styles.smallTrackName} numberOfLines={1}>
                  {item.trackName}
                </Text>
                <Text style={styles.smallArtistName} numberOfLines={1}>
                  {item.artistName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Your Favorites</Text>
          <View style={styles.favoriteList}>
            {favoriteTracks.map((track) => (
              <TrackCard key={`fav-${track.trackId}`} track={track} />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 24,
  },
  page: {
    marginRight: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#1a1a1a",
    width: 20,
    borderRadius: 4,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  smallCard: {
    width: 110,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  smallArtwork: {
    width: "100%",
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  smallTrackName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  smallArtistName: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  favoriteList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
