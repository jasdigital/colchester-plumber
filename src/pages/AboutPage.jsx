import React from 'react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { useSEO } from '../hooks/useSEO';

export function AboutPage() {
  useSEO({ 
    title: "About", 
    desc: "Local, family-run plumbers serving Colchester for over 15 years. Gas Safe, fully insured, and customer-first." 
  });

  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">About Us</h1>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-gray-700">
            We're a local, family-run plumbing and heating business serving homes and businesses across Colchester and Essex. Over the last 15+ years, we've built our reputation on fast response, fair pricing, and top-quality workmanship.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Gas Safe registered engineers for safe boiler and gas work</li>
            <li>Fully insured and DBS-checked team</li>
            <li>Digital quotes, invoices and certificates</li>
            <li>Honest advice—if it's a cheap fix, we'll tell you</li>
          </ul>
        </div>
        <Card>
          <div className="text-lg font-semibold">Credentials</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>• Gas Safe Registration: 123456 (placeholder)</li>
            <li>• Public Liability Insurance: £5m cover</li>
            <li>• Waste Carrier Licence (where applicable)</li>
            <li>• Health & Safety compliant (RAMS on request)</li>
          </ul>
        </Card>
      </div>
    </Container>
  );
}