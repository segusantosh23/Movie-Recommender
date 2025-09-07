
import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getNowPlayingMovies } from '../services/tmdbService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';

type TimeWindow = 'day' | 'week';

// Helper to shuffle the array for a mixed experience
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Trending: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both global trending and movies currently playing in India concurrently for a real-time mix
        const [trendingResponse, nowPlayingIndiaResponse] = await Promise.all([
          getTrendingMovies(timeWindow),
          getNowPlayingMovies({ region: 'IN' })
        ]);
        
        const combinedMovies = [
            ...trendingResponse.results,
            ...nowPlayingIndiaResponse.results
        ];

        // Deduplicate movies based on their ID to avoid showing the same movie twice
        const uniqueMoviesMap = new Map<number, Movie>();
        combinedMovies.forEach(movie => {
          uniqueMoviesMap.set(movie.id, movie);
        });
        const uniqueMovies = Array.from(uniqueMoviesMap.values());

        // Shuffle the unique movies for a mixed view of global and Indian cinema
        setMovies(shuffleArray(uniqueMovies));

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

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;

  const getButtonClass = (isActive: boolean) => {
    const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
    if (isActive) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} bg-gray-700 hover:bg-gray-600 text-gray-300`;
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold border-l-4 border-blue-500 pl-4">Trending & Popular</h1>
        <div className="flex flex-wrap items-center gap-2">
            {/* Time Window Toggle */}
            <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
                <button onClick={() => setTimeWindow('day')} className={getButtonClass(timeWindow === 'day')}>
                    Today
                </button>
                <button onClick={() => setTimeWindow('week')} className={getButtonClass(timeWindow === 'week')}>
                    This Week
                </button>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Trending;