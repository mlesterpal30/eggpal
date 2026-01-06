import { create } from "zustand";

interface KdramaQuery {
	genreId?: number;
	rating?: number;
}
interface KdramaQueryStore {
	kdramaQuery: KdramaQuery;
	setGenreId: (genreId: number) => void;
	setRating: (rating: number) => void;
}

const useKrdramaQueryStore = create<KdramaQueryStore>((set) => ({
	kdramaQuery: {},
	setGenreId: (genreId) =>
		set((store) => ({ kdramaQuery: { ...store.kdramaQuery, genreId } })),
	setRating: (rating) =>
		set((store) => ({ kdramaQuery: { ...store.kdramaQuery, rating } }))
}));

export default useKrdramaQueryStore;