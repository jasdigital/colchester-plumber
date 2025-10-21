import React from 'react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ContactForm } from '../components/ContactForm';
import { useSEO } from '../hooks/useSEO';
import { PHONE, EMAIL, WHATSAPP } from '../data/constants';

export function ContactPage() {
  useSEO({ 
    title: "Contact", 
    desc: "Request a free quote or book a plumber online. Fast responses for Colchester and nearby areas." 
  });

  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-2 text-gray-700">Tell us what's wrong and get a fast, accurate quote.</p>
      
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <div className="text-lg font-semibold">Quick Contact</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>Phone: <a className="text-blue-700" href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a></li>
              <li>Email: <a className="text-blue-700" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li>WhatsApp: <a className="text-blue-700" href={`https://wa.me/${WHATSAPP}`}>Message us</a></li>
              <li>Hours: Mon–Sun, 7am–10pm (24/7 emergencies)</li>
            </ul>
            <Button href={`tel:${PHONE.replace(/\s/g, "")}`} className="mt-4 w-full">Call now</Button>
            <Button variant="outline" href={`https://wa.me/${WHATSAPP}`} className="mt-2 w-full">WhatsApp</Button>
          </Card>
        </div>
      </div>
    </Container>
  );
}