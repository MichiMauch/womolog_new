import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import OvernightStaysPerYear from '../component/OvernightStaysPerYear';
import PlacesPerYear from '../component/PlacesPerYear';
import PlacesPerCountry from '../component/PlacesPerCountry'; // Neue Komponente importieren

const Stats = () => {
  return (
    <GeistProvider>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <h1>Statistiken</h1>
        <div style={{ marginBottom: '40px' }}>
          <h2>Übernachtungen pro Jahr</h2>
          <OvernightStaysPerYear />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <h2>Plätze pro Jahr</h2>
          <PlacesPerYear />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <h2>Orte und Übernachtungen pro Land</h2>
          <PlacesPerCountry />
        </div>
      </div>
    </GeistProvider>
  );
};

export default Stats;
