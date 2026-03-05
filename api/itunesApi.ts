import axiosClient from "./axiosClient";
import { Track } from "../types";

export const fetchTracks =  async (searchTerm: string): Promise<Track[]> => {
    try {
        const response = await axiosClient.get('/search', {
            params: {
                term: searchTerm,
                media: 'music',
                entity: 'song',
                limit: 20,
            },
        });

        return response.data.results.map((item: any) => ({
            trackId: item.trackId,
            trackName: item.trackName,
            artistName: item.artistName,
            collectionName: item.collectionName || 'Unknown Album',
            artworkUrl100: item.artworkUrl100,
            previewUrl: item.previewUrl,
        }));
    } catch (error) {
        console.error("Error fetching tracks from iTunes:", error);
        return [];
    }
};