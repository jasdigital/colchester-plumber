import React from 'react';
import { Button } from '../ui/Button';
import { PHONE, WHATSAPP } from '../../data/constants';

export function StickyContactBar() {
  return (
    <div className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 rounded-2xl border bg-white p-2 shadow-lg md:hidden">
      <div className="flex items-center gap-2">
        <Button href={`tel:${PHONE.replace(/\s/g, "")}`} className="px-3">Call</Button>
        <Button variant="outline" href={`https://wa.me/${WHATSAPP}`} className="px-3">WhatsApp</Button>
        <Button variant="ghost" href="#/contact" className="px-3">Quote</Button>
      </div>
    </div>
  );
}