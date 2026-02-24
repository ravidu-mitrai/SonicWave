import { useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import TrackCard from "../../components/TrackCard";
import { mockTracks } from "../../constants/mockData";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width * 0.85;

export default function DiscoverScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const groupedTracks: (typeof mockTracks)[] = [];
  for (let i = 0; i < mockTracks.length; i += 2) {
    groupedTracks.push(mockTracks.slice(i, i + 2));
  }

  const recentTracks = mockTracks.slice(0, 4);
  const favoriteTracks = mockTracks.slice(2, 6);

  return (
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
          <View style={[styles.page, { width:PAGE_WIDTH }]}>
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
            <View style={styles.smallCard}>
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
            </View>
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

  // ── Section ──
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

  // ── Small card (Recently Searched) ──
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

  // ── Favorites ──
  favoriteList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});