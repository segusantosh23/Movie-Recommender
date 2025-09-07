import React, { useContext } from 'react';
import { MovieListsContext } from '../contexts/MovieListsContext';
import MovieCard from '../components/MovieCard';

const Liked: React.FC = () => {
  const movieListsContext = useContext(MovieListsContext);
  const likedMovies = movieListsContext?.likedMovies || [];

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-blue-500 pl-4">Your Liked Movies</h1>
      {likedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {likedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-10">You haven't liked any movies yet.</p>
      )}
    </div>
  );
};

export default Liked;