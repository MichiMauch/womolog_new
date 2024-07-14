import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import CountryCount from '../component/CountryCount'; // Pfad anpassen, falls notwendig
import CountryList from '../component/CountryList'; // Pfad anpassen, falls notwendig
import CountryPlaces from '../component/CountryPlaces'; // Pfad anpassen, falls notwendig
import VisitsPerYear from '../component/VisitsPerYear'; // Pfad anpassen, falls notwendig
import TotalVisitedPlaces from '../component/TotalVisitedPlaces'; // Pfad anpassen, falls notwendig
import DuplicateTitles from '../component/DuplicateTitles'; // Pfad anpassen, falls notwendig
import VisitsPerCountry from '../component/VisitsPerCountry'; // Pfad anpassen, falls notwendig
import MultipleVisitsPerPlacePerCountry from '../component/MultipleVisitsPerPlacePerCountry'; // Pfad anpassen, falls notwendig
import NewPlacesPerYear from '../component/NewPlacesPerYear'; // Pfad anpassen, falls notwendig
import TotalNights from '../component/TotalNights'; // Pfad anpassen, falls notwendig
import AverageNightsPerPlace from '../component/AverageNightsPerPlace'; // Pfad anpassen, falls notwendig
import LongestTrip from '../component/LongestTrip'; // Pfad anpassen, falls notwendig
import MostNightsPlace from '../component/MostNightsPlace'; // Pfad anpassen, falls notwendig
import SeasonAnalysis from '../component/SeasonAnalysis'; // Pfad anpassen, falls notwendig
import PopularMonth from '../component/PopularMonth'; // Pfad anpassen, falls notwendig
import MostVisitedPlaces from '../component/MostVisitedPlaces'; // Pfad anpassen, falls notwendig
import LongestPause from '../component/LongestPause'; // Pfad anpassen, falls notwendig
import TotalDistancePerYear from '../component/TotalDistancePerYear'; // Pfad anpassen, falls notwendig
import TotalDistance from '../component/TotalDistance'; // Pfad anpassen, falls notwendig


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
