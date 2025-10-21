
import React, { useState, useContext, FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { MovieListsContext } from '../contexts/MovieListsContext';
import { NotificationContext } from '../contexts/NotificationContext';
import MovieCard from '../components/MovieCard';

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  const movieListsContext = useContext(MovieListsContext);
  const notificationContext = useContext(NotificationContext);
  
  if (!authContext || !authContext.user) {
    // This should not be reached due to ProtectedRoute
    return <div className="text-center text-slate-400">User not found.</div>;
  }

  const { user, updateUser } = authContext;
  const [username, setUsername] = useState(user.username);
  
  const ratedMovies = movieListsContext?.ratedMovies || [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      updateUser(username.trim());
      notificationContext?.addNotification('Profile updated successfully!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-blue-500 pl-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Your Profile</h1>
        <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-lg shadow-xl max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 border-l-4 border-cyan-500 pl-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Your Rated Movies</h2>
        {ratedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {ratedMovies
              .slice() // Create a shallow copy to avoid mutating the original array
              .sort((a, b) => b.rating - a.rating)
              .map(({ movie, rating }) => (
                <MovieCard key={movie.id} movie={movie} userRating={rating} />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400 text-lg mt-10 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
            <p>You haven't rated any movies yet. Find a movie and give it a rating to see it here!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
