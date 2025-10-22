
import React, { useState, useEffect, useContext } from 'react';
import { getDiscoverMovies, getNowPlayingMovies } from '../services/tmdbService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import Carousel from '../components/Carousel';
import HeroCarousel from '../components/HeroCarousel';
import MovieGrid from '../components/MovieGrid';
import { GenreContext } from '../contexts/GenreContext';
import SortDropdown from '../components/SortDropdown';

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
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [filteredNowPlayingMovies, setFilteredNowPlayingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCertification, setSelectedCertification] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('popularity.desc');

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
        
        const baseParams: Record<string, string> = { sort_by: sortOption };
        if (selectedGenre) baseParams.with_genres = selectedGenre;
        if (selectedYear) baseParams.primary_release_year = selectedYear;

        // When sorting by newest, ensure we don't include future movies.
        if (sortOption === 'release_date.desc') {
          const today = new Date().toISOString().split('T')[0];
          baseParams['primary_release_date.lte'] = today;
        }

        // Create a separate params object for the Indian movie query to get films originating from India.
        const indianParams = { ...baseParams, with_origin_country: 'IN' };
        
        // Create a separate params object for the global query.
        const globalParams = { ...baseParams };
        
        // Apply US-specific certification filter using "less than or equal to".
        if (selectedCertification) {
          globalParams.certification_country = 'US';
          globalParams['certification.lte'] = selectedCertification;
        }

        const regionParams = { region: 'IN' };

        const [globalResponse, indianResponse, nowPlayingResponse] = await Promise.all([
          getDiscoverMovies(globalParams),
          getDiscoverMovies(indianParams),
          getNowPlayingMovies(regionParams)
        ]);
        
        setNowPlayingMovies(nowPlayingResponse.results);
        
        const combinedMovies = [...globalResponse.results, ...indianResponse.results];

        // Deduplicate movies based on their ID
        const uniqueMoviesMap = new Map<number, Movie>();
        combinedMovies.forEach(movie => {
          uniqueMoviesMap.set(movie.id, movie);
        });
        const uniqueMovies = Array.from(uniqueMoviesMap.values());
        
        // Only shuffle if sorting by popularity to maintain some variety, otherwise respect the sort order
        if (sortOption === 'popularity.desc') {
            setMovies(shuffleArray(uniqueMovies));
        } else {
            setMovies(uniqueMovies);
        }

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
  }, [selectedGenre, selectedYear, selectedCertification, sortOption]);

  // Effect to filter "Now Playing" movies on the client-side
  useEffect(() => {
    let filtered = nowPlayingMovies;

    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genre_ids?.includes(parseInt(selectedGenre, 10)));
    }

    if (selectedYear) {
      filtered = filtered.filter(movie => movie.release_date?.startsWith(selectedYear));
    }

    setFilteredNowPlayingMovies(filtered);
  }, [nowPlayingMovies, selectedGenre, selectedYear]);

  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedCertification('');
    setSortOption('popularity.desc');
  };

  const filterSelectClasses = "bg-netflix-gray border border-netflix-light-gray text-netflix-white text-sm rounded-lg focus:ring-netflix-red focus:border-netflix-red block w-full p-2.5";

  return (
    <div className="space-y-12">
      {loading ? <Spinner /> : error ? <div className="text-center text-red-500 text-xl mt-10">{error}</div> : (
        <>
          {/* Hero Carousel */}
          <div className="mb-8">
            <HeroCarousel movies={movies.slice(0, 6)} />
          </div>
          
          <section className="bg-netflix-dark-gray p-6 rounded-lg border border-netflix-gray">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label htmlFor="genre-select" className="block mb-2 text-sm font-medium text-netflix-text-gray">Genre</label>
                  <select id="genre-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className={filterSelectClasses}>
                      <option value="">All Genres</option>
                      {genres.map(genre => (
                        <option key={genre.id} value={String(genre.id)}>{genre.name}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="year-select" className="block mb-2 text-sm font-medium text-netflix-text-gray">Year</label>
                  <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={filterSelectClasses}>
                      <option value="">Any Year</option>
                      {years.map(year => (
                        <option key={year} value={String(year)}>{year}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="certification-select" className="block mb-2 text-sm font-medium text-netflix-text-gray">Rating</label>
                  <select id="certification-select" value={selectedCertification} onChange={(e) => setSelectedCertification(e.target.value)} className={filterSelectClasses}>
                      <option value="">Any Rating</option>
                      {ageRatings.map(rating => (
                        <option key={rating.value} value={rating.value}>{rating.label}</option>
                      ))}
                  </select>
                </div>
                <div>
                    <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                </div>
                <button onClick={handleResetFilters} className="bg-netflix-gray hover:bg-netflix-light-gray text-netflix-white font-bold py-2.5 px-4 rounded-lg w-full transition-colors h-[42px]">
                    Reset
                </button>
            </div>
          </section>

          <Carousel title="Now Playing in Theaters" movies={filteredNowPlayingMovies} />
          
          <MovieGrid 
            movies={movies} 
            title="Discover Movies"
            showTitle={movies.length > 0}
          />
          
          {movies.length === 0 && (
            <div className="text-center text-netflix-text-gray text-lg mt-10 p-6 bg-netflix-dark-gray rounded-lg border border-netflix-gray">
              <h3 className="text-xl font-semibold mb-2 text-netflix-white">No Movies Found</h3>
              <p>We couldn't find any movies matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
