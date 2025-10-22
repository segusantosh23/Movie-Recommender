import React, { useRef, useState, useEffect } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface CarouselProps {
  title: string;
  movies: Movie[];
}

const Carousel: React.FC<CarouselProps> = ({ title, movies }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft < 5); // A small tolerance
      // Add a small tolerance (e.g., 5px) for floating point inaccuracies
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Use a ResizeObserver for more robust checking
      const observer = new ResizeObserver(() => {
        checkScrollPosition();
      });
      observer.observe(container);

      checkScrollPosition(); // Initial check
      container.addEventListener('scroll', checkScrollPosition, { passive: true });
      
      return () => {
        observer.disconnect();
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [movies]); // Re-check when movies change or on resize

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      // Scroll by 80% of the visible width for a nice page-like effect
      const scrollAmount = clientWidth * 0.8; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  // Don't render the component if there are no movies
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="relative group mb-12">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 border-l-4 border-blue-500 pl-4">{title}</h2>
      
      {!isAtStart && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-slate-200 dark:border-slate-600"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {movies.map(movie => (
          <div key={movie.id} className="flex-shrink-0 w-64 sm:w-72 md:w-80">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      
      {!isAtEnd && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-slate-200 dark:border-slate-600"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </section>
  );
};

export default Carousel;