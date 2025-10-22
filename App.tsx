
import React from 'react';
// Fix: Use namespace import for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MovieListsProvider } from './contexts/MovieListsContext';
import { GenreProvider } from './contexts/GenreContext';
import { MovieModalProvider } from './contexts/MovieModalContext';

import Home from './pages/Home';
import Trending from './pages/Trending';
import Liked from './pages/Liked';
import Watchlist from './pages/Watchlist';
import SearchResults from './pages/SearchResults';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import MovieDetail from './pages/MovieDetail';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MovieListsProvider>
        <GenreProvider>
          <MovieModalProvider>
            <ReactRouterDOM.HashRouter>
              <ReactRouterDOM.Routes>
                <ReactRouterDOM.Route path="/" element={<Auth />} />
                <ReactRouterDOM.Route element={<MainLayout />}>
                  <ReactRouterDOM.Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <ReactRouterDOM.Route path="/trending" element={<Trending />} />
                  <ReactRouterDOM.Route path="/liked" element={<ProtectedRoute><Liked /></ProtectedRoute>} />
                  <ReactRouterDOM.Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                  <ReactRouterDOM.Route path="/search/:query" element={<SearchResults />} />
                  <ReactRouterDOM.Route path="/movie/:id" element={<MovieDetail />} />
                </ReactRouterDOM.Route>
              </ReactRouterDOM.Routes>
            </ReactRouterDOM.HashRouter>
          </MovieModalProvider>
        </GenreProvider>
      </MovieListsProvider>
    </AuthProvider>
  );
};

export default App;
