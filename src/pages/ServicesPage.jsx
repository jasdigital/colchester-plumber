import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { services } from '../data/services';

const ServicesPage = () => {
  useSEO({ 
    title: "Plumbing & Heating Services", 
    desc: "Explore our full range of plumbing and heating services in Colchester and Essex." 
  });

  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Services</h1>
      <p className="mt-2 max-w-2xl text-gray-700">
        Click a service to learn more, see FAQs, and request a quote.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {services.map((s) => (
          <Card key={s.slug}>
            <div className="text-lg font-semibold">{s.title}</div>
            <p className="mt-1 text-sm text-gray-600">{s.short}</p>
            <div className="mt-4 flex gap-2">
              <Button href={`#/service/${s.slug}`}>Learn more</Button>
              <Button variant="outline" href="#/contact">Get a quote</Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export { ServicesPage };