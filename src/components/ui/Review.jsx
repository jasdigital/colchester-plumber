import React from 'react';
import { Card } from './Card';

export function Review({ name, text }) {
  return (
    <Card>
      <div className="text-sm text-gray-700">{text}</div>
      <div className="mt-3 text-xs font-semibold text-gray-900">{name}</div>
    </Card>
  );
}