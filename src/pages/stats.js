import React from 'react';
import 'leaflet/dist/leaflet.css';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import CountryCount from '../components/CountryCount'; // Pfad anpassen, falls notwendig
import CountryList from '../components/CountryList'; // Pfad anpassen, falls notwendig
import CountryPlaces from '../components/CountryPlaces'; // Pfad anpassen, falls notwendig
import VisitsPerYear from '../components/VisitsPerYear'; // Pfad anpassen, falls notwendig
import TotalVisitedPlaces from '../components/TotalVisitedPlaces'; // Pfad anpassen, falls notwendig
import DuplicateTitles from '../components/DuplicateTitles'; // Pfad anpassen, falls notwendig
import VisitsPerCountry from '../components/VisitsPerCountry'; // Pfad anpassen, falls notwendig
import MultipleVisitsPerPlacePerCountry from '../components/MultipleVisitsPerPlacePerCountry'; // Pfad anpassen, falls notwendig
import NewPlacesPerYear from '../components/NewPlacesPerYear'; // Pfad anpassen, falls notwendig
import TotalNights from '../components/TotalNights'; // Pfad anpassen, falls notwendig
import AverageNightsPerPlace from '../components/AverageNightsPerPlace'; // Pfad anpassen, falls notwendig
import LongestTrip from '../components/LongestTrip'; // Pfad anpassen, falls notwendig
import MostNightsPlace from '../components/MostNightsPlace'; // Pfad anpassen, falls notwendig
import SeasonAnalysis from '../components/SeasonAnalysis'; // Pfad anpassen, falls notwendig
import PopularMonth from '../components/PopularMonth'; // Pfad anpassen, falls notwendig
import MostVisitedPlaces from '../components/MostVisitedPlaces'; // Pfad anpassen, falls notwendig
import LongestPause from '../components/LongestPause'; // Pfad anpassen, falls notwendig
import TotalDistancePerYear from '../components/TotalDistancePerYear'; // Pfad anpassen, falls notwendig
import TotalDistance from '../components/TotalDistance'; // Pfad anpassen, falls notwendig


const Stats = () => {
  return (
    <GeistProvider>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <h1>Statistiken</h1>
        <div style={{ marginBottom: '40px' }}>
          <CountryCount />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <CountryList />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <CountryPlaces />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <VisitsPerYear />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <NewPlacesPerYear />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <TotalVisitedPlaces />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <DuplicateTitles />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <VisitsPerCountry />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <MultipleVisitsPerPlacePerCountry />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <TotalNights />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <AverageNightsPerPlace />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <LongestTrip />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <MostNightsPlace />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <SeasonAnalysis />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <PopularMonth />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <MostVisitedPlaces />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <LongestPause />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <TotalDistancePerYear />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <TotalDistance />
        </div>
      </div>
    </GeistProvider>
  );
};

export default Stats;
