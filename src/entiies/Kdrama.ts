export interface Kdrama {
    id: number;
    title: string;
    description: string;
    rating: number;
    releaseDate: string;
    genreId: number;
    genre: Genre;
}


export interface Genre {
    id: number;
    name: string;
    description: string | null;
  }