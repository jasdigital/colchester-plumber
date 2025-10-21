import React, { useState } from 'react';

const FAQ = ({ items }) => {
  const [open, setOpen] = useState(null);
  
  return (
    <div className="divide-y rounded-2xl border">
      {items.map((f, i) => (
        <div key={i} className="p-4">
          <button 
            className="flex w-full items-center justify-between text-left" 
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="font-medium">{f.q}</div>
            <span className="text-xl">{open === i ? "–" : "+"}</span>
          </button>
          {open === i && (
            <div className="mt-2 text-sm text-gray-700">{f.a}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export { FAQ };