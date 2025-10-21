import React from 'react';

export const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-gray-300">
    {children}
  </span>
);