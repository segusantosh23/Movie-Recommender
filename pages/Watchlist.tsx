import React, { useContext } from 'react';
import { MovieListsContext } from '../contexts/MovieListsContext';
import MovieCard from '../components/MovieCard';

const Watchlist: React.FC = () => {
  const movieListsContext = useContext(MovieListsContext);
  const watchlist = movieListsContext?.watchlist || [];

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-blue-500 pl-4">Your Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {watchlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-10">Your watchlist is empty.</p>
      )}
    </div>
  );
};

export default Watchlist;