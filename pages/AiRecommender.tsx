
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
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-4">AI Movie Recommender</h1>
        <p className="text-base md:text-lg text-gray-300">Tell our AI what you're in the mood for, and get instant, personalized movie recommendations!</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A funny movie with a talking animal' or 'A serious historical drama'"
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg resize-none"
            rows={2}
          />
          <button type="submit" disabled={loading} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
            {loading ? 'Thinking...' : 'Get Recs'}
          </button>
        </div>
      </form>
      
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-400 mb-3 text-center">Need inspiration? Try one of these:</h3>
        <div className="flex flex-wrap justify-center gap-2">
            {examplePrompts.map((p, i) => (
                <button key={i} onClick={() => setPrompt(p)} className="bg-gray-700 hover:bg-gray-600 text-sm text-gray-200 px-3 py-1 rounded-full transition">
                    {p}
                </button>
            ))}
        </div>
      </div>

      {loading && <Spinner />}
      {error && <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}

      {recommendations.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Here are your recommendations!</h2>
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 transform hover:border-blue-500 transition">
              <h3 className="text-2xl font-bold text-blue-400">{rec.title} ({rec.year})</h3>
              <p className="mt-2 text-gray-300">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiRecommender;