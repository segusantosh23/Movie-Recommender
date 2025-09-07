
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdbService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';

const SearchResults: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      try {
        setLoading(true);
        setError(null);
        const response = await searchMovies(query);
        setMovies(response.results);
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

    performSearch();
  }, [query]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Search Results for "{query}"</h1>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-10">No movies found matching your query.</p>
      )}
    </div>
  );
};

export default SearchResults;