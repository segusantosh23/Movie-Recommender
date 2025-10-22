
import React from 'react';
// Fix: Use namespace import for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';

const Logo: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <ReactRouterDOM.Link to="/home" className="group flex items-center space-x-2 text-netflix-white flex-shrink-0" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {/* Hinge */}
      <circle cx="2.5" cy="5.5" r="1.5" fill="#4A5568"/>

      {/* Top Clapstick (animated part) */}
      <g className="transition-transform duration-300 ease-in-out group-hover:-rotate-[25deg]" style={{transformOrigin: '2.5px 5.5px'}}>
          <path d="M1 3 H 23 L 22 8 H 0 Z" fill="#111827"/>
          {/* Stripes */}
          <path fill="#E5E7EB" d="M4 3.5 L 6 3.5 L 5 8 L 3 8 Z"/>
          <path fill="#E5E7EB" d="M8 3.5 L 10 3.5 L 9 8 L 7 8 Z"/>
          <path fill="#E5E7EB" d="M12 3.5 L 14 3.5 L 13 8 L 11 8 Z"/>
          <path fill="#E5E7EB" d="M16 3.5 L 18 3.5 L 17 8 L 15 8 Z"/>
          <path fill="#E5E7EB" d="M20 3.5 L 22 3.5 L 21 8 L 19 8 Z"/>
      </g>

      {/* Bottom Board */}
      <path d="M0 9 H 24 V 22 H 0 Z" fill="#111827" />
      <g fill="#9CA3AF">
          {/* Lines */}
          <rect x="2" y="11" width="20" height="0.3" />
          <rect x="2" y="13.5" width="20" height="0.3" />
          <rect x="2" y="16" width="20" height="0.3" />
          <rect x="2" y="18.5" width="20" height="0.3" />
      </g>
    </svg>
    <span className="text-xl font-bold">
      Movie Recommender
    </span>
  </ReactRouterDOM.Link>
);

export default Logo;
