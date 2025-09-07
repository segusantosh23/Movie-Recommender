

import React, { createContext, ReactNode, useContext } from 'react';
import { Movie, RatedMovie } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AuthContext } from './AuthContext';
import { NotificationContext } from './NotificationContext';

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
  const notificationContext = useContext(NotificationContext);
  const userKey = authContext?.user?.username || 'guest';

  const [likedMovies, setLikedMovies] = useLocalStorage<Movie[]>(`cinesuggest_liked_${userKey}`, []);
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>(`cinesuggest_watchlist_${userKey}`, []);
  const [ratedMovies, setRatedMovies] = useLocalStorage<RatedMovie[]>(`cinesuggest_rated_${userKey}`, []);

  const isLiked = (movieId: number) => likedMovies.some(m => m.id === movieId);
  const isOnWatchlist = (movieId: number) => watchlist.some(m => m.id === movieId);

  const toggleLike = (movie: Movie) => {
    const title = movie.title || movie.name;
    if (isLiked(movie.id)) {
      setLikedMovies(prev => prev.filter(m => m.id !== movie.id));
      notificationContext?.addNotification(`Removed "${title}" from liked movies.`);
    } else {
      setLikedMovies(prev => [...prev, movie]);
      notificationContext?.addNotification(`Added "${title}" to liked movies!`);
    }
  };

  const toggleWatchlist = (movie: Movie) => {
    const title = movie.title || movie.name;
    if (isOnWatchlist(movie.id)) {
      setWatchlist(prev => prev.filter(m => m.id !== movie.id));
      notificationContext?.addNotification(`Removed "${title}" from your watchlist.`);
    } else {
      setWatchlist(prev => [...prev, movie]);
      notificationContext?.addNotification(`Added "${title}" to your watchlist!`);
    }
  };
  
  const getMovieRating = (movieId: number): number | undefined => {
    return ratedMovies.find(r => r.movie.id === movieId)?.rating;
  };

  const rateMovie = (movie: Movie, rating: number) => {
    const title = movie.title || movie.name;
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
    notificationContext?.addNotification(`You rated "${title}" ${rating}/10!`);
  };

  return (
    <MovieListsContext.Provider value={{ likedMovies, watchlist, ratedMovies, isLiked, isOnWatchlist, toggleLike, toggleWatchlist, rateMovie, getMovieRating }}>
      {children}
    </MovieListsContext.Provider>
  );
};