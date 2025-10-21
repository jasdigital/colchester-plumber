import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Review } from '../components/ui/Review';
import { PHONE, WHATSAPP, RESPONSE_TIME } from '../data/constants';
import { services, customerReviews } from '../data/services';

const Hero = () => (
  <div className="relative overflow-hidden border-b bg-gradient-to-b from-blue-50 to-white">
    <Container className="py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge>Local • Colchester & Essex</Badge>
            <Badge>Gas Safe</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Your Local Colchester Plumber — Fast Response, Fair Prices.
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            From leaks to full bathroom installations — trusted by homes and businesses across Colchester.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={`tel:${PHONE.replace(/\s/g, "")}`}>Call {PHONE}</Button>
            <Button variant="outline" href="#/contact">Request a Free Quote</Button>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-700 md:grid-cols-3">
            <li>✔️ 24/7 emergencies</li>
            <li>✔️ Fixed, fair pricing</li>
            <li>✔️ Gas Safe registered</li>
            <li>✔️ 15+ years local</li>
            <li>✔️ Fully insured</li>
            <li>✔️ Card payments</li>
          </ul>
        </div>
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden rounded-3xl bg-gray-200 shadow-inner"></div>
          <div className="absolute -left-4 -top-4 rounded-2xl bg-white p-3 shadow-md">
            <div className="text-xs text-gray-600">Avg. Response</div>
            <div className="text-lg font-bold">{RESPONSE_TIME}</div>
          </div>
        </div>
      </div>
    </Container>
  </div>
);

const ServicesGrid = () => (
  <Container className="py-14">
    <div className="mb-8 flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold">Plumbing & Heating Services</h2>
        <p className="mt-1 text-gray-600">Click a service to see details and FAQs.</p>
      </div>
      <Button variant="outline" href="#/services">View all</Button>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      {services.map((s) => (
        <Card key={s.slug}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">{s.title}</div>
              <p className="mt-1 text-sm text-gray-600">{s.short}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button href={`#/service/${s.slug}`} className="px-3 py-1 text-sm">Learn more</Button>
            <Button variant="outline" href="#/contact" className="px-3 py-1 text-sm">Get a quote</Button>
          </div>
        </Card>
      ))}
    </div>
  </Container>
);

const ReviewsSection = () => (
  <Container className="py-14">
    <div className="mb-8">
      <h2 className="text-2xl font-bold">What Our Customers Say</h2>
      <p className="mt-1 text-gray-600">Real feedback from homeowners and landlords across Colchester.</p>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      {customerReviews.map((review, index) => (
        <Review key={index} name={review.name} text={review.text} />
      ))}
    </div>
    <div className="mt-6">
      <Button variant="outline" href="#/reviews">Read more reviews</Button>
    </div>
  </Container>
);

const CTABanner = () => (
  <div className="border-y bg-blue-50">
    <Container className="flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
      <div>
        <div className="text-xl font-semibold">Need a plumber today?</div>
        <div className="text-gray-700">Call now or book a visit online in under 60 seconds.</div>
      </div>
      <div className="flex gap-3">
        <Button href={`tel:${PHONE.replace(/\s/g, "")}`}>Call {PHONE}</Button>
        <Button variant="outline" href="#/contact">Book Online</Button>
      </div>
    </Container>
  </div>
);

const HomePage = () => {
  useSEO({
    title: "Trusted Plumber in Colchester | 24/7 Plumbing & Heating",
    desc: "Fast, affordable plumbing and heating services in Colchester & Essex. Emergency callouts, boiler repairs, bathrooms, leak detection. Call today.",
  });

  return (
    <>
      <Hero />
      <ServicesGrid />
      <ReviewsSection />
      <CTABanner />
      <Container className="py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <div className="text-xl font-semibold">Why choose us</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Local, family-run business with 15+ years' experience</li>
              <li>Gas Safe engineers, fully insured, DBS-checked</li>
              <li>Upfront pricing and clear communication</li>
              <li>Card payments and digital paperwork</li>
            </ul>
          </Card>
          <Card>
            <div className="text-xl font-semibold">Typical jobs we handle</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Leaking taps, toilets, showers & pipework</li>
              <li>Boiler breakdowns, servicing & smart controls</li>
              <li>Radiator installs, balancing & powerflushing</li>
              <li>Full bathroom renovations & repairs</li>
            </ul>
          </Card>
        </div>
      </Container>
    </>
  );
};

export { HomePage };