import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MovieListsProvider } from './contexts/MovieListsContext';
import { GenreProvider } from './contexts/GenreContext';
import { MovieModalProvider } from './contexts/MovieModalContext';
import { NotificationProvider } from './contexts/NotificationContext';

import Home from './pages/Home';
import Trending from './pages/Trending';
import Liked from './pages/Liked';
import Watchlist from './pages/Watchlist';
import SearchResults from './pages/SearchResults';
import AiRecommender from './pages/AiRecommender';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import MovieModal from './components/MovieModal';
import Profile from './pages/Profile';
import Notifications from './components/Notifications';
import ScrollToTopButton from './components/ScrollToTopButton';
import PersonDetail from './pages/PersonDetail';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MovieListsProvider>
          <GenreProvider>
            <MovieModalProvider>
              <HashRouter>
                <div className="flex flex-col min-h-screen text-gray-100">
                  <Navbar />
                  <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<Auth />} />
                      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                      <Route path="/trending" element={<Trending />} />
                      <Route path="/ai-recommender" element={<AiRecommender />} />
                      <Route path="/liked" element={<ProtectedRoute><Liked /></ProtectedRoute>} />
                      <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                      <Route path="/search/:query" element={<SearchResults />} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/person/:id" element={<PersonDetail />} />
                    </Routes>
                  </main>
                  <Footer />
                  <MovieModal />
                  <Notifications />
                  <ScrollToTopButton />
                </div>
              </HashRouter>
            </MovieModalProvider>
          </GenreProvider>
        </MovieListsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;