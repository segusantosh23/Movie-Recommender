import React from 'react';
// Fix: Use namespace import for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
import { Movie } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../constants';

interface HeroBannerProps {
  movie: Movie;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ movie }) => {
  const backgroundImageUrl = `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`;

  return (
    <div
      className="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full bg-cover bg-center bg-no-repeat relative rounded-lg sm:rounded-xl overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 lg:p-12 text-white z-10 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-4 drop-shadow-lg leading-tight">{movie.title || movie.name}</h1>
        <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 drop-shadow-md line-clamp-3 sm:line-clamp-none">{movie.overview}</p>
        <ReactRouterDOM.Link 
          to={`/movie/${movie.id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 md:px-8 rounded-full text-sm sm:text-base md:text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          View Details
        </ReactRouterDOM.Link>
      </div>
    </div>
  );
};

export default HeroBanner;
