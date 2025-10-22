import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  showTitle?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, title, showTitle = true }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      {showTitle && title && (
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 border-l-4 border-blue-500 pl-4">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
