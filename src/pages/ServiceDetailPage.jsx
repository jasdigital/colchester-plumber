import React, { useMemo } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FAQ } from '../components/ui/FAQ';
import { services } from '../data/services';
import { PHONE, WHATSAPP } from '../data/constants';

const ServiceDetailPage = ({ slug }) => {
  const svc = useMemo(() => services.find((s) => s.slug === slug), [slug]);
  
  useSEO({ title: svc ? svc.title : "Service", desc: svc?.short });

  if (!svc) {
    return (
      <Container className="py-14">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="mt-2 text-gray-600">
          Please return to the <a href="#/services" className="text-blue-700">Services</a> page.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{svc.title}</h1>
          <p className="mt-3 text-gray-700">{svc.content}</p>
          <div className="mt-8">
            <div className="text-lg font-semibold">FAQs</div>
            <div className="mt-3">
              <FAQ items={svc.faqs} />
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <Card>
            <div className="text-lg font-semibold">Get a fast quote</div>
            <p className="mt-1 text-sm text-gray-600">
              Send details and photos—typically we respond within 1 hour.
            </p>
            <div className="mt-4 flex gap-2">
              <Button href={`tel:${PHONE.replace(/\s/g, "")}`} className="w-full">Call</Button>
              <Button variant="outline" href={`https://wa.me/${WHATSAPP}`} className="w-full">WhatsApp</Button>
            </div>
            <Button variant="ghost" href="#/contact" className="mt-2 w-full">Use contact form</Button>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export { ServiceDetailPage };