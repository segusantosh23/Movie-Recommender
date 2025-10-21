
import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getNowPlayingMovies } from '../services/tmdbService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import SortDropdown from '../components/SortDropdown';

type TimeWindow = 'day' | 'week';

const sortMovies = (moviesToSort: Movie[], option: string): Movie[] => {
  const sorted = [...moviesToSort];
  switch (option) {
    case 'popularity.desc':
      return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    case 'release_date.desc':
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Compare against the end of today
      return sorted
        .filter(movie => movie.release_date && new Date(movie.release_date) <= today)
        .sort((a, b) => {
          const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
          const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
          return dateB - dateA;
        });
    case 'release_date.asc':
      return sorted.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateA - dateB;
      });
    case 'vote_average.desc':
      return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    default:
      return moviesToSort;
  }
};

const Trending: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortedMovies, setSortedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');
  const [sortOption, setSortOption] = useState<string>('popularity.desc');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [trendingResponse, nowPlayingIndiaResponse] = await Promise.all([
          getTrendingMovies(timeWindow),
          getNowPlayingMovies({ region: 'IN' })
        ]);
        
        const combinedMovies = [
            ...trendingResponse.results,
            ...nowPlayingIndiaResponse.results
        ];

        const uniqueMoviesMap = new Map<number, Movie>();
        combinedMovies.forEach(movie => {
          uniqueMoviesMap.set(movie.id, movie);
        });
        const uniqueMovies = Array.from(uniqueMoviesMap.values());
        
        setMovies(uniqueMovies);

      } catch (err) {
         if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [timeWindow]);

  useEffect(() => {
    setSortedMovies(sortMovies(movies, sortOption));
  }, [movies, sortOption]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;

  const getButtonClass = (isActive: boolean) => {
    const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
    if (isActive) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300`;
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 border-l-4 border-blue-500 pl-4">Trending & Popular</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button onClick={() => setTimeWindow('day')} className={getButtonClass(timeWindow === 'day')}>
                    Today
                </button>
                <button onClick={() => setTimeWindow('week')} className={getButtonClass(timeWindow === 'week')}>
                    This Week
                </button>
            </div>
            <div className="w-full sm:w-48">
              <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
            </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {sortedMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Trending;
