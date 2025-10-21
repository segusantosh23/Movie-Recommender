
import React, { useState, useContext } from 'react';
import { getAIRecommendations } from '../services/geminiService';
import { AIRecommendation } from '../types';
import Spinner from '../components/Spinner';
import { MovieListsContext } from '../contexts/MovieListsContext';

const AiRecommender: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const movieListsContext = useContext(MovieListsContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const likedMovieTitles = movieListsContext?.likedMovies
        .map(movie => movie.title || movie.name)
        .filter((title): title is string => !!title) ?? [];

      const results = await getAIRecommendations(prompt, likedMovieTitles);
      setRecommendations(results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching AI recommendations.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const examplePrompts = [
    "Movies like 'Inception' with mind-bending plots.",
    "Cozy romantic comedies for a rainy day.",
    "Action-packed sci-fi films from the 80s.",
    "Underrated horror movies that are actually scary."
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">AI Movie Recommender</h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">Tell our AI what you're in the mood for, and get instant, personalized movie recommendations!</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A funny movie with a talking animal' or 'A serious historical drama'"
            className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4 pr-32 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-lg resize-none"
            rows={2}
          />
          <button type="submit" disabled={loading} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-2 px-6 rounded-lg disabled:bg-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105">
            {loading ? 'Thinking...' : 'Get Recs'}
          </button>
        </div>
      </form>
      
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-3 text-center">Need inspiration? Try one of these:</h3>
        <div className="flex flex-wrap justify-center gap-2">
            {examplePrompts.map((p, i) => (
                <button key={i} onClick={() => setPrompt(p)} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full transition">
                    {p}
                </button>
            ))}
        </div>
      </div>

      {loading && <Spinner />}
      {error && <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">Here are your recommendations!</h2>
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 transform hover:border-cyan-500/50 transition flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-500 dark:text-blue-400">{rec.title} <span className="text-slate-500 dark:text-slate-400 font-normal text-base">({rec.year})</span></h3>
                <p className="mt-2 text-slate-700 dark:text-slate-300">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiRecommender;
