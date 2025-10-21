import React from 'react';
import { Container } from '../ui/Container';
import { BUSINESS_NAME, PHONE, EMAIL } from '../../data/constants';
import { services } from '../../data/services';
import { coverageAreas } from '../../data/areas';

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-gray-50 py-10">
      <Container className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="text-lg font-semibold">{BUSINESS_NAME}</div>
          <p className="mt-2 text-sm text-gray-600">Trusted local plumbers serving Colchester and surrounding areas.</p>
          <div className="mt-3 text-sm text-gray-700">Gas Safe Registered • Fully Insured</div>
        </div>
        <div>
          <div className="text-sm font-semibold">Contact</div>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>Phone: <a className="text-blue-700" href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a></li>
            <li>Email: <a className="text-blue-700" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li>Hours: Mon–Sun, 7am–10pm (24/7 emergencies)</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Services</div>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {services.map((s) => (
              <li key={s.slug}><a className="text-blue-700" href={`#/service/${s.slug}`}>{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Areas</div>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {coverageAreas.slice(0,6).map((a) => (<li key={a}>{a}</li>))}
            <li><a className="text-blue-700" href="#/areas">See full area list</a></li>
          </ul>
        </div>
      </Container>
      <Container className="mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
      </Container>
    </footer>
  );
}