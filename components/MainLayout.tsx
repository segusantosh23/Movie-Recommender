import React from 'react';
// Fix: Use namespace import for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MovieModal from './MovieModal';
import Notifications from './Notifications';
import ScrollToTopButton from './ScrollToTopButton';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200 bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 page-fade-in">
        <div className="w-full">
          <ReactRouterDOM.Outlet />
        </div>
      </main>
      <Footer />
      <MovieModal />
      <Notifications />
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;
