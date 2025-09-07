import React, { useState, useEffect, useContext } from 'react';
import { getDiscoverMovies } from '../services/tmdbService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import { GenreContext } from '../contexts/GenreContext';

// Helper to shuffle the array for a mixed experience
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCertification, setSelectedCertification] = useState<string>('');

  const genreContext = useContext(GenreContext);
  const genres = genreContext?.genres || [];

  const years: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }

  const ageRatings = [
    { label: 'Child (7+)', value: 'PG' },
    { label: 'Teen (13+)', value: 'PG-13' },
    { label: 'Mature (16+)', value: 'R' },
    { label: 'Adult (18+)', value: 'NC-17' },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const baseParams: Record<string, string> = { sort_by: 'popularity.desc' };
        if (selectedGenre) baseParams.with_genres = selectedGenre;
        if (selectedYear) baseParams.primary_release_year = selectedYear;

        // Create a separate params object for the Indian movie query to get films originating from India.
        const indianParams = { ...baseParams, with_origin_country: 'IN' };
        
        // Create a separate params object for the global query.
        const globalParams = { ...baseParams };
        
        // Apply US-specific certification filter using "less than or equal to".
        // This ensures that selecting e.g., "Teen (13+)" includes G, PG, and PG-13 rated movies.
        if (selectedCertification) {
          globalParams.certification_country = 'US';
          globalParams['certification.lte'] = selectedCertification;
        }

        const [globalResponse, indianResponse] = await Promise.all([
          getDiscoverMovies(globalParams),
          getDiscoverMovies(indianParams)
        ]);
        
        const combinedMovies = [...globalResponse.results, ...indianResponse.results];

        // Deduplicate movies based on their ID
        const uniqueMoviesMap = new Map<number, Movie>();
        combinedMovies.forEach(movie => {
          uniqueMoviesMap.set(movie.id, movie);
        });
        const uniqueMovies = Array.from(uniqueMoviesMap.values());
        
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
  }, [selectedGenre, selectedYear, selectedCertification]);

  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedCertification('');
  };

  const filterSelectClasses = "bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

  return (
    <div className="space-y-8">
      <section className="bg-gray-800/50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="genre-select" className="block mb-2 text-sm font-medium text-gray-400">Genre</label>
              <select id="genre-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className={filterSelectClasses}>
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={String(genre.id)}>{genre.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="year-select" className="block mb-2 text-sm font-medium text-gray-400">Year Released</label>
              <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={filterSelectClasses}>
                  <option value="">Any Year</option>
                  {years.map(year => (
                    <option key={year} value={String(year)}>{year}</option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="certification-select" className="block mb-2 text-sm font-medium text-gray-400">Age Rating</label>
              <select id="certification-select" value={selectedCertification} onChange={(e) => setSelectedCertification(e.target.value)} className={filterSelectClasses}>
                  <option value="">Any Rating</option>
                  {ageRatings.map(rating => (
                    <option key={rating.value} value={rating.value}>{rating.label}</option>
                  ))}
              </select>
            </div>
            <button onClick={handleResetFilters} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 px-4 rounded-lg w-full transition-colors">
                Reset Filters
            </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-4">Discover Movies</h2>
        {loading ? <Spinner /> : error ? <div className="text-center text-red-500 text-xl mt-10">{error}</div> : (
          movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-lg mt-10 p-6 bg-gray-800/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Movies Found</h3>
              <p>We couldn't find any movies matching your criteria. Try adjusting your filters.</p>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default Home;