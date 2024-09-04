"use client";  // Diese Komponente wird auf der Client-Seite ausgeführt

import { useEffect } from "react";

// Erweitere den globalen Window-Typ
declare global {
  interface Window {
    _mtm?: any[];
  }
}

export default function MatomoTracker() {
  useEffect(() => {
    // Weise _mtm als Array zu oder erhalte das bestehende
    window._mtm = window._mtm || [];
    window._mtm.push({ 'mtm.startTime': (new Date().getTime()), event: 'mtm.Start' });
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = 'https://stageopenmetrics.netnode.ch/js/container_eO70Vyok.js';  // Deine Container-ID eingefügt
    if (s && s.parentNode) {
      s.parentNode.insertBefore(g, s);
    }
  }, []);

  return null;  // Kein sichtbares HTML-Element, nur der Tracking-Code wird eingefügt
}
