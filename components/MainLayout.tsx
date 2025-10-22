import React from 'react';
// Fix: Use namespace import for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen text-netflix-white bg-netflix-black transition-colors duration-300 font-netflix">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 page-fade-in">
        <div className="w-full">
          <ReactRouterDOM.Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
