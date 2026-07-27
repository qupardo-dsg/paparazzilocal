"use client";

import { useState } from "react";

const TEXT = "Ofertas imperdibles\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Env\u00EDo gratis sobre $50.000 dentro de Los Andes";

export default function AnnouncementBar() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="bg-[var(--color-accent)] text-[var(--color-accent-on)] text-sm font-medium py-2 relative">
      <button
        onClick={() => setClosed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="max-w-4xl mx-auto overflow-hidden">
        <div
          className="flex whitespace-nowrap w-max"
          style={{ animation: "marquee 20s linear infinite" }}
        >
          <span>{TEXT}</span>
          <span>{TEXT}</span>
          <span>{TEXT}</span>
          <span>{TEXT}</span>
          <span>{TEXT}</span>
          <span>{TEXT}</span>
        </div>
      </div>
    </div>
  );
}
