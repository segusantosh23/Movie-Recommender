import React, { useState, useRef, useEffect } from 'react';
import { Movie } from '../types';

interface VideoPreviewProps {
  movie: Movie;
  isVisible: boolean;
  onClose: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ movie, isVisible, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      // Simulate video preview - in a real app, you'd load actual trailer
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-netflix-black/90 backdrop-blur-sm z-30 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Mock video player - replace with actual video element */}
        <div className="w-full h-full bg-netflix-dark-gray flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-netflix-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-netflix-white text-sm">Preview: {movie.title || movie.name}</p>
            <p className="text-netflix-text-gray text-xs mt-1">Click to play trailer</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-netflix-gray/80 hover:bg-netflix-gray text-netflix-white p-2 rounded-full transition-all"
          aria-label="Close preview"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Play button overlay */}
        <button
          onClick={() => {
            // In a real app, this would play the actual trailer
            console.log('Playing trailer for:', movie.title);
          }}
          className="absolute inset-0 flex items-center justify-center bg-netflix-black/20 hover:bg-netflix-black/40 transition-all"
        >
          <div className="bg-netflix-red hover:bg-netflix-red-hover text-netflix-white p-4 rounded-full transition-all transform hover:scale-110">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;
