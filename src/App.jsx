import React, { useEffect, useMemo, useState } from "react";

/**
 * Colchester Plumber SPA
 * - Single-file React app using Tailwind classes
 * - Hash-based routing (no external deps)
 * - Pages: Home, Services, Individual Service, About, Reviews, Coverage Areas, Contact
 * - Features: Sticky call/WhatsApp bar, FAQ accordions, Reviews, Map placeholder, Simple Quote form
 * - Ready to adapt into a full project (split components, add API endpoints, etc.)
 */

// ------------ Utilities & Data ------------
const PHONE = "01206 123 456"; // Replace with real number
const WHATSAPP = "+441206123456"; // E.164 format for WhatsApp link
const EMAIL = "bookings@colchester-plumbing.co.uk";
const BUSINESS_NAME = "Colchester Plumbing & Heating Co.";

const serviceList = [
  {
    slug: "emergency-plumbing",
    title: "Emergency Plumbing",
    short: "24/7 callouts for leaks, bursts & blockages.",
    content:
      "When a pipe bursts or a toilet overflows, speed matters. Our Colchester-based emergency plumbers arrive fast with fully stocked vans to diagnose and resolve issues on the spot.",
    faqs: [
      {
        q: "How fast can you arrive?",
        a: "We aim for 60–90 minutes across CO1–CO7, traffic permitting.",
      },
      {
        q: "Do you charge a callout fee?",
        a: "Transparent fixed callout fee covers the first 30 minutes. We’ll confirm before attending.",
      },
    ],
  },
  {
    slug: "boiler-repairs-servicing",
    title: "Boiler Repairs & Servicing",
    short: "Gas Safe engineers for all major brands.",
    content:
      "Keep your heating efficient and safe. We service and repair combi, system and regular boilers, with same-day diagnostics and parts sourcing.",
    faqs: [
      { q: "Are you Gas Safe?", a: "Yes. All engineers are Gas Safe registered." },
      {
        q: "Do you offer annual plans?",
        a: "Yes—annual service plans with priority callouts and reminders.",
      },
    ],
  },
  {
    slug: "bathroom-installations",
    title: "Bathroom Installations",
    short: "Design, supply & fit, end-to-end project management.",
    content:
      "From compact ensuites to luxury family bathrooms, we handle plumbing, tiling, electrics (with Part P), and finishing. We work cleanly and keep you informed.",
    faqs: [
      {
        q: "Do you provide design support?",
        a: "Yes—we’ll measure, mock up layouts, and source fixtures within your budget.",
      },
      {
        q: "How long does a typical install take?",
        a: "Most standard installs take 5–10 working days depending on scope.",
      },
    ],
  },
  {
    slug: "leak-detection",
    title: "Leak Detection",
    short: "Non-invasive methods to find hidden leaks fast.",
    content:
      "Thermal imaging, moisture meters and acoustic tools help us pinpoint leaks under floors and behind walls, minimising disruption and repair costs.",
    faqs: [
      {
        q: "Will you need to lift floors?",
        a: "We use non-invasive methods first. If access is needed, we’ll keep it minimal.",
      },
      {
        q: "Can you provide a report for insurers?",
        a: "Yes—we can provide photos and a findings report for claims.",
      },
    ],
  },
  {
    slug: "heating-radiator-repairs",
    title: "Heating & Radiator Repairs",
    short: "Cold spots, noisy pipes, poor circulation fixed.",
    content:
      "From balancing to powerflushing, valve replacements and pump fixes, we restore efficiency and comfort to your heating system.",
    faqs: [
      {
        q: "Do you offer powerflushing?",
        a: "Yes—improves circulation, reduces noise, and can lower bills.",
      },
      {
        q: "Can you fit smart thermostats?",
        a: "We install and configure leading smart controls, including multi-zone setups.",
      },
    ],
  },
  {
    slug: "gas-safety-certificates",
    title: "Landlord Gas Safety Certificates (CP12)",
    short: "Legally required checks with digital certification.",
    content:
      "For landlords and agents: punctual inspections, minor fixes on the day where possible, and same-day digital CP12 certificates.",
    faqs: [
      {
        q: "How soon can you attend?",
        a: "Often within 48 hours. Block bookings for agents available.",
      },
      {
        q: "Do you remind for renewals?",
        a: "Yes—annual reminders and multi-property scheduling.",
      },
    ],
  },
];

const coverageAreas = [
  "Colchester (CO1–CO7)",
  "Wivenhoe",
  "Stanway",
  "Lexden",
  "Marks Tey",
  "Elmstead Market",
  "Layer-de-la-Haye",
  "Mile End",
  "Rowhedge",
  "Great Horksley",
];

// Simple router (hash-based)
function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash.replace(/^#/, "") || "/");
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const navigate = (to) => {
    if (!to.startsWith("#")) window.location.hash = to;
    else window.location.hash = to.replace(/^#/, "");
  };
  return { route, navigate };
}

// Helper: set page title/description
function useSEO({ title, desc }) {
  useEffect(() => {
    document.title = title ? `${title} | ${BUSINESS_NAME}` : BUSINESS_NAME;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc || "");
  }, [title, desc]);
}

// ------------ UI Components ------------
const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>{children}</div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-gray-300">
    {children}
  </span>
);

const Button = ({ children, onClick, href, variant = "primary", className = "", type }) => {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:opacity-90";
  const styles = {
    primary: "bg-blue-600 text-white",
    outline: "bg-white text-blue-700 ring-1 ring-blue-200",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
  };
  if (href) {
    return (
      <a href={href} className={`${base} ${styles[variant]} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button type={type || "button"} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Header = ({ current, onNav }) => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/reviews", label: "Reviews" },
    { to: "/areas", label: "Coverage" },
    { to: "/contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-green-500" />
          <div className="text-left">
            <div className="text-sm font-bold leading-tight">{BUSINESS_NAME}</div>
            <div className="text-xs text-gray-500">Plumbing • Heating • Gas</div>
          </div>
        </a>
        <nav className="hidden gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.to}
              href={`#${l.to}`}
              className={`text-sm font-medium ${current === l.to ? "text-blue-700" : "text-gray-700 hover:text-blue-700"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href={`tel:${PHONE.replace(/\s/g, "")}`}>Call {PHONE}</Button>
          <Button variant="outline" href={`https://wa.me/${WHATSAPP}`}>WhatsApp</Button>
        </div>
      </Container>
    </header>
  );
};

const Footer = () => (
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
          {serviceList.map((s) => (
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
    <Container className="mt-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.</Container>
  </footer>
);

const StickyContactBar = () => (
  <div className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 rounded-2xl border bg-white p-2 shadow-lg md:hidden">
    <div className="flex items-center gap-2">
      <Button href={`tel:${PHONE.replace(/\s/g, "")}`} className="px-3">Call</Button>
      <Button variant="outline" href={`https://wa.me/${WHATSAPP}`} className="px-3">WhatsApp</Button>
      <Button variant="ghost" href="#/contact" className="px-3">Quote</Button>
    </div>
  </div>
);

const Hero = ({ onQuote }) => (
  <div className="relative overflow-hidden border-b bg-gradient-to-b from-blue-50 to-white">
    <Container className="py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge>Local • Colchester & Essex</Badge>
            <Badge>Gas Safe</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Your Local Colchester Plumber — Fast Response, Fair Prices.</h1>
          <p className="mt-4 text-lg text-gray-700">From leaks to full bathroom installations — trusted by homes and businesses across Colchester.</p>
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
            <div className="text-lg font-bold">60–90 mins</div>
          </div>
        </div>
      </div>
    </Container>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}>{children}</div>
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
      {serviceList.map((s) => (
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

const Review = ({ name, text }) => (
  <Card>
    <div className="text-sm text-gray-700">{text}</div>
    <div className="mt-3 text-xs font-semibold text-gray-900">{name}</div>
  </Card>
);

const ReviewsSection = () => (
  <Container className="py-14">
    <div className="mb-8">
      <h2 className="text-2xl font-bold">What Our Customers Say</h2>
      <p className="mt-1 text-gray-600">Real feedback from homeowners and landlords across Colchester.</p>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      <Review name="Jo M (CO3)" text="Excellent service — they fixed our leak within the hour and left everything tidy." />
      <Review name="Dan P (Wivenhoe)" text="Engineer arrived same morning, diagnosed boiler issue and had it running by lunchtime." />
      <Review name="Sophie K (Lexden)" text="Professional, friendly and fairly priced. Will use again for our bathroom refurb." />
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

const FAQ = ({ items }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y rounded-2xl border">
      {items.map((f, i) => (
        <div key={i} className="p-4">
          <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen(open === i ? null : i)}>
            <div className="font-medium">{f.q}</div>
            <span className="text-xl">{open === i ? "–" : "+"}</span>
          </button>
          {open === i && <div className="mt-2 text-sm text-gray-700">{f.a}</div>}
        </div>
      ))}
    </div>
  );
};

// ------------ Pages ------------
const HomePage = () => {
  useSEO({
    title: "Trusted Plumber in Colchester | 24/7 Plumbing & Heating",
    desc:
      "Fast, affordable plumbing and heating services in Colchester & Essex. Emergency callouts, boiler repairs, bathrooms, leak detection. Call today.",
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
              <li>Local, family-run business with 15+ years’ experience</li>
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

const ServicesPage = () => {
  useSEO({ title: "Plumbing & Heating Services", desc: "Explore our full range of plumbing and heating services in Colchester and Essex." });
  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Services</h1>
      <p className="mt-2 max-w-2xl text-gray-700">Click a service to learn more, see FAQs, and request a quote.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {serviceList.map((s) => (
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

const ServiceDetailPage = ({ slug }) => {
  const svc = useMemo(() => serviceList.find((s) => s.slug === slug), [slug]);
  useSEO({ title: svc ? svc.title : "Service", desc: svc?.short });
  if (!svc) return (
    <Container className="py-14">
      <h1 className="text-2xl font-bold">Service not found</h1>
      <p className="mt-2 text-gray-600">Please return to the <a href="#/services" className="text-blue-700">Services</a> page.</p>
    </Container>
  );
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
            <p className="mt-1 text-sm text-gray-600">Send details and photos—typically we respond within 1 hour.</p>
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

const AboutPage = () => {
  useSEO({ title: "About", desc: "Local, family-run plumbers serving Colchester for over 15 years. Gas Safe, fully insured, and customer-first." });
  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">About Us</h1>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-gray-700">
            We’re a local, family-run plumbing and heating business serving homes and businesses across Colchester and Essex. Over the last 15+ years, we’ve built our reputation on fast response, fair pricing, and top-quality workmanship.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Gas Safe registered engineers for safe boiler and gas work</li>
            <li>Fully insured and DBS-checked team</li>
            <li>Digital quotes, invoices and certificates</li>
            <li>Honest advice—if it’s a cheap fix, we’ll tell you</li>
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
};

const ReviewsPage = () => {
  useSEO({ title: "Reviews", desc: "Read reviews from customers across Colchester who trust our plumbing and heating services." });
  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Customer Reviews</h1>
      <p className="mt-2 text-gray-700">We’re proud of our 5★ reputation across Colchester.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <Review key={i} name={`Customer #${i + 1}`} text="Great service—on time, professional and reasonably priced. Highly recommended!" />
        ))}
      </div>
    </Container>
  );
};

const AreasPage = () => {
  useSEO({ title: "Coverage Areas", desc: "We cover Colchester and surrounding towns and villages, including Wivenhoe, Stanway, Lexden and more." });
  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Coverage Areas</h1>
      <p className="mt-2 max-w-2xl text-gray-700">We cover CO1–CO7 and surrounding areas. If you’re just outside, give us a call—we often travel further for larger jobs.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-lg font-semibold">Areas</div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
            {coverageAreas.map((a) => (<li key={a}>• {a}</li>))}
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
};

const ContactPage = () => {
  useSEO({ title: "Contact", desc: "Request a free quote or book a plumber online. Fast responses for Colchester and nearby areas." });
  const [status, setStatus] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // Here you would POST to your API / email service.
    console.log("Form submission", data);
    setStatus("Thanks! We’ll be in touch shortly.");
    e.currentTarget.reset();
  };
  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-2 text-gray-700">Tell us what’s wrong and add photos for a faster, more accurate quote.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="md:col-span-2">
          <Card>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input required name="name" className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input required type="email" name="email" className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input required name="phone" className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Postcode</label>
                <input name="postcode" className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Issue</label>
                <textarea required name="issue" rows={4} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="Tell us what’s happening…" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Photos (optional)</label>
                <input type="file" name="photos" multiple className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <button className="w-full rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white hover:opacity-90">Send</button>
              </div>
              {status && <div className="md:col-span-2 text-sm text-green-700">{status}</div>}
            </div>
          </Card>
        </form>
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
};

// ------------ App & Routing ------------
const RouteRenderer = ({ route }) => {
  // route like "/", "/services", "/service/slug"
  if (route === "/") return <HomePage />;
  if (route === "/services") return <ServicesPage />;
  if (route.startsWith("/service/")) return <ServiceDetailPage slug={route.split("/")[2]} />;
  if (route === "/about") return <AboutPage />;
  if (route === "/reviews") return <ReviewsPage />;
  if (route === "/areas") return <AreasPage />;
  if (route === "/contact") return <ContactPage />;
  return (
    <Container className="py-14">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-600">Return <a href="#/" className="text-blue-700">home</a>.</p>
    </Container>
  );
};

export default function App() {
  const { route } = useHashRoute();

  // JSON-LD for basic LocalBusiness SEO (adjust values in production)
  useEffect(() => {
    const ld = {
      "@context": "https://schema.org",
      "@type": "Plumber",
      name: BUSINESS_NAME,
      telephone: PHONE,
      email: EMAIL,
      areaServed: "Colchester, Essex",
      url: window.location.href,
      sameAs: [
        // add Google Business Profile, Facebook, etc.
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Colchester",
        addressRegion: "Essex",
        postalCode: "CO1",
        addressCountry: "UK",
      },
      openingHours: "Mo-Su 07:00-22:00",
      priceRange: "££",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Plumbing & Heating Services",
        itemListElement: serviceList.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title },
        })),
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header current={route} />
      <main>
        <RouteRenderer route={route} />
      </main>
      <Footer />
      <StickyContactBar />
    </div>
  );
}
