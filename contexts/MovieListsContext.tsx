

import React, { createContext, ReactNode, useContext } from 'react';
import { Movie, RatedMovie } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AuthContext } from './AuthContext';

interface MovieListsContextType {
  likedMovies: Movie[];
  watchlist: Movie[];
  ratedMovies: RatedMovie[];
  isLiked: (movieId: number) => boolean;
  isOnWatchlist: (movieId: number) => boolean;
  toggleLike: (movie: Movie) => void;
  toggleWatchlist: (movie: Movie) => void;
  rateMovie: (movie: Movie, rating: number) => void;
  getMovieRating: (movieId: number) => number | undefined;
}

export const MovieListsContext = createContext<MovieListsContextType | undefined>(undefined);

interface MovieListsProviderProps {
  children: ReactNode;
}

export const MovieListsProvider: React.FC<MovieListsProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const userKey = authContext?.user?.username || 'guest';

  const [likedMovies, setLikedMovies] = useLocalStorage<Movie[]>(`cinesuggest_liked_${userKey}`, []);
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>(`cinesuggest_watchlist_${userKey}`, []);
  const [ratedMovies, setRatedMovies] = useLocalStorage<RatedMovie[]>(`cinesuggest_rated_${userKey}`, []);

  const isLiked = (movieId: number) => likedMovies.some(m => m.id === movieId);
  const isOnWatchlist = (movieId: number) => watchlist.some(m => m.id === movieId);

  const toggleLike = (movie: Movie) => {
    if (isLiked(movie.id)) {
      setLikedMovies(prev => prev.filter(m => m.id !== movie.id));
    } else {
      setLikedMovies(prev => [...prev, movie]);
    }
  };

  const toggleWatchlist = (movie: Movie) => {
    if (isOnWatchlist(movie.id)) {
      setWatchlist(prev => prev.filter(m => m.id !== movie.id));
    } else {
      setWatchlist(prev => [...prev, movie]);
    }
  };
  
  const getMovieRating = (movieId: number): number | undefined => {
    return ratedMovies.find(r => r.movie.id === movieId)?.rating;
  };

  const rateMovie = (movie: Movie, rating: number) => {
    setRatedMovies(prev => {
      const existingRatingIndex = prev.findIndex(r => r.movie.id === movie.id);
      if (existingRatingIndex > -1) {
        // Update existing rating
        const updated = [...prev];
        updated[existingRatingIndex] = { ...updated[existingRatingIndex], rating };
        return updated;
      } else {
        // Add new rating
        return [...prev, { movie, rating }];
      }
    });
  };

  return (
    <MovieListsContext.Provider value={{ likedMovies, watchlist, ratedMovies, isLiked, isOnWatchlist, toggleLike, toggleWatchlist, rateMovie, getMovieRating }}>
      {children}
    </MovieListsContext.Provider>
  );
};