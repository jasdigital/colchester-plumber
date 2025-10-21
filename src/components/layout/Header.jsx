import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { BUSINESS_NAME, PHONE, WHATSAPP } from '../../data/constants';
import logo from '../../assets/images/Colchester-Plumber_Icon.svg';

export function Header({ current }) {
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
          <img src={logo} alt="Colchester Plumber Logo" className="h-12 w-12" />
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
              className={`text-sm font-medium ${
                current === l.to ? "text-blue-700" : "text-gray-700 hover:text-blue-700"
              }`}
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
}