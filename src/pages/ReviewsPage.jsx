import React from 'react';
import { Container } from '../components/ui/Container';
import { Review } from '../components/ui/Review';
import { useSEO } from '../hooks/useSEO';

export function ReviewsPage() {
  useSEO({ 
    title: "Reviews", 
    desc: "Read reviews from customers across Colchester who trust our plumbing and heating services." 
  });

  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Customer Reviews</h1>
      <p className="mt-2 text-gray-700">We're proud of our 5★ reputation across Colchester.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <Review 
            key={i} 
            name={`Customer #${i + 1}`} 
            text="Great service—on time, professional and reasonably priced. Highly recommended!" 
          />
        ))}
      </div>
    </Container>
  );
}