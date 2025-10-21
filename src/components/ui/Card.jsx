import React from 'react';

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}>{children}</div>
);