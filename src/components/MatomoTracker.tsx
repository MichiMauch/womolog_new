"use client"; // Diese Komponente wird auf der Client-Seite ausgeführt

import { useEffect } from 'react';

// Erweitere den globalen Window-Typ für TypeScript
declare global {
  interface Window {
    _paq?: any[];
  }
}

const MatomoTracker = () => {
  useEffect(() => {
    // Initialisiere window._paq, wenn es nicht existiert
    window._paq = window._paq || [];
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);

    (function () {
      var u = "//stageopenmetrics.netnode.ch/";
      window._paq.push(['setTrackerUrl', u + 'matomo.php']);
      window._paq.push(['setSiteId', '2']);
      
      var d = document, 
          g = d.createElement('script'), 
          s = d.getElementsByTagName('script')[0];
      
      g.async = true;
      g.src = u + 'matomo.js';
      
      // Überprüfe, ob s und s.parentNode existieren, um den TypeScript-Fehler zu vermeiden
      if (s && s.parentNode) {
        s.parentNode.insertBefore(g, s);
      }
    })();
  }, []); // Der Code wird nur einmal ausgeführt

  return null; // Diese Komponente rendert nichts, nur der Tracking-Code wird ausgeführt
};

export default MatomoTracker;
