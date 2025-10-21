import React from 'react';

export const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>{children}</div>
);