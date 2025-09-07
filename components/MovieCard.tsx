import React, { useContext, useState, useEffect } from 'react';
import { Movie, WatchProvider } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import Rating from './Rating';
import { AuthContext } from '../contexts/AuthContext';
import { MovieListsContext } from '../contexts/MovieListsContext';
import { GenreContext } from '../contexts/GenreContext';
import { getMovieDetails } from '../services/tmdbService';
import { MovieModalContext } from '../contexts/MovieModalContext';

interface MovieCardProps {
  movie: Movie;
  userRating?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, userRating }) => {
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : `https://picsum.photos/500/750?random=${movie.id}`;
    
  const authContext = useContext(AuthContext);
  const movieListsContext = useContext(MovieListsContext);
  const genreContext = useContext(GenreContext);
  const movieModalContext = useContext(MovieModalContext);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const details = await getMovieDetails(String(movie.id));
        const watchProviders = details['watch/providers']?.results;
        
        const providersByRegion = watchProviders?.IN || watchProviders?.US;
        
        if (providersByRegion) {
          const allProviderList = [
            ...(providersByRegion.flatrate || []),
            ...(providersByRegion.rent || []),
            ...(providersByRegion.buy || [])
          ];
          
          const uniqueProviders = allProviderList.reduce((acc, current) => {
            if (!acc.find(item => item.provider_id === current.provider_id)) {
              acc.push(current);
            }
            return acc;
          }, [] as WatchProvider[]);

          if (uniqueProviders.length > 0) {
            setProviders(uniqueProviders.slice(0, 3));
          }
        }
      } catch (error) {
        console.error(`Failed to fetch providers for movie ${movie.id}:`, error);
      }
    };

    fetchProviders();
  }, [movie.id]);

  if (!movieListsContext || !genreContext || !movieModalContext) {
    return null; 
  }

  const { isLiked, isOnWatchlist, toggleLike, toggleWatchlist } = movieListsContext;
  const { getGenreNames } = genreContext;
  const { openModal } = movieModalContext;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(movie);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
  };
  
  const handleCardClick = () => {
    openModal(movie.id);
  };

  const movieGenres = getGenreNames(movie.genre_ids || []).slice(0, 2);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 group relative">
       {userRating && (
        <div className="absolute top-2 left-2 z-20 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
          <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{userRating} / 10</span>
        </div>
      )}
       {authContext?.user && (
        <div className="absolute top-2 right-2 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={handleLikeClick} title={isLiked(movie.id) ? 'Unlike' : 'Like'} className="bg-black/60 p-2 rounded-full text-white hover:bg-black/80 transition-colors duration-200">
             <svg className={`w-5 h-5 transition-colors ${isLiked(movie.id) ? 'text-red-500' : 'text-white'}`} fill={isLiked(movie.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
          </button>
          <button onClick={handleWatchlistClick} title={isOnWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'} className="bg-black/60 p-2 rounded-full text-white hover:bg-black/80 transition-colors duration-200">
            <svg className={`w-5 h-5 transition-colors ${isOnWatchlist(movie.id) ? 'text-blue-500' : 'text-white'}`} fill={isOnWatchlist(movie.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          </button>
        </div>
      )}
      <div onClick={handleCardClick} className="cursor-pointer">
        <div className="relative">
          <img src={imageUrl} alt={movie.title} className="w-full h-auto object-cover aspect-[2/3]" />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <p className="text-white text-center text-sm">{movie.overview.substring(0, 150)}{movie.overview.length > 150 ? '...' : ''}</p>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-base sm:text-lg truncate" title={movie.title || movie.name}>{movie.title || movie.name}</h3>
           {movieGenres.length > 0 && (
            <p className="text-xs text-gray-400 truncate mt-0.5 sm:mt-1">
              {movieGenres.join(', ')}
            </p>
          )}
          <div className="flex justify-between items-center mt-1 sm:mt-2 text-sm text-gray-400">
            <span>{movie.release_date?.substring(0, 4)}</span>
            <div className="flex items-center gap-2">
                <Rating value={movie.vote_average} />
                <div className="flex items-center space-x-1">
                {providers.map(provider => (
                    <img
                    key={provider.provider_id}
                    src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                    className="w-5 h-5 rounded"
                    />
                ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;