import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent">
      <div className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Movie Recommender. All Rights Reserved.</p>
        <p className="text-sm mt-2">Powered by React, Tailwind CSS, TMDB, and Gemini API.</p>
      </div>
    </footer>
  );
};

export default Footer;