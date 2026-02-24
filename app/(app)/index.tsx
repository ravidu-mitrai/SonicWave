import { useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import TrackCard from "../../components/TrackCard";
import { mockTracks } from "../../constants/mockData";

export default function DiscoverScreen() {
  const groupedTracks = [];

  const [activeIndex, setActiveIndex] = useState(0);

  for (let i = 0; i < mockTracks.length; i += 2) {
    groupedTracks.push(mockTracks.slice(i, i + 2));
  }
  const { width } = Dimensions.get("window");
  const PAGE_WIDTH = width * 0.8;

  

  return (
    <View style={styles.container}>
      <FlatList
        data={groupedTracks}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        snapToInterval={PAGE_WIDTH}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: PAGE_WIDTH }]}>
            {item.map((track) => (
              <TrackCard key={track.trackId} track={track} />
            ))}
          </View>
        )}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / PAGE_WIDTH);
          setActiveIndex(index);
        }}
      />
      <View style={styles.dotsContainer}>
        {groupedTracks.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  page: {
    justifyContent: "center",
    marginLeft: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 4,
    backgroundColor: 'transparent', 
  },

  activeDot: {
    backgroundColor: '#333', 
  },
});
