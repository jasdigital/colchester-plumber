import React from 'react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { useSEO } from '../hooks/useSEO';
import { coverageAreas } from '../data/areas';

export function AreasPage() {
  useSEO({ 
    title: "Coverage Areas", 
    desc: "We cover Colchester and surrounding towns and villages, including Wivenhoe, Stanway, Lexden and more." 
  });

  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Coverage Areas</h1>
      <p className="mt-2 max-w-2xl text-gray-700">
        We cover CO1–CO7 and surrounding areas. If you're just outside, give us a call—we often travel further for larger jobs.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-lg font-semibold">Areas</div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
            {coverageAreas.map((area) => (
              <li key={area}>• {area}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="text-lg font-semibold">Map</div>
          <div className="mt-3 aspect-video w-full rounded-xl bg-gray-200" />
          <p className="mt-2 text-xs text-gray-500">Embed Google Map here in production.</p>
        </Card>
      </div>
    </Container>
  );
}