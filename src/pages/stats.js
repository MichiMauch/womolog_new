import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import '../app/globals.css';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import CountryPlaces from '../components/CountryPlaces'; // Pfad anpassen, falls notwendig
import VisitsPerYear from '../components/VisitsPerYear'; // Pfad anpassen, falls notwendig
import TotalVisitedPlaces from '../components/TotalVisitedPlaces'; // Pfad anpassen, falls notwendig
import DuplicateTitles from '../components/DuplicateTitles'; // Pfad anpassen, falls notwendig
import VisitsPerCountry from '../components/VisitsPerCountry'; // Pfad anpassen, falls notwendig
import NewPlacesPerYear from '../components/NewPlacesPerYear'; // Pfad anpassen, falls notwendig
import TotalNights from '../components/TotalNights'; // Pfad anpassen, falls notwendig
import AverageNightsPerPlace from '../components/AverageNightsPerPlace'; // Pfad anpassen, falls notwendig
import LongestTrip from '../components/LongestTrip'; // Pfad anpassen, falls notwendig
import MostNightsPlace from '../components/MostNightsPlace'; // Pfad anpassen, falls notwendig
import SeasonAnalysis from '../components/SeasonAnalysis'; // Pfad anpassen, falls notwendig
import PopularMonth from '../components/PopularMonth'; // Pfad anpassen, falls notwendig
import MostVisitedPlaces from '../components/MostVisitedPlaces'; // Pfad anpassen, falls notwendig
import LongestPause from '../components/LongestPause'; // Pfad anpassen, falls notwendig
import KilometersPerYear from '../components/TotalDistancePerYear'; // Pfad anpassen, falls notwendig
import TotalKilometers from '../components/TotalDistance'; // Pfad anpassen, falls notwendig

const Map = dynamic(() => import('../components/LeafletMap'), { ssr: false });

const Stats = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const result = await response.json();
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <GeistProvider>
      <CssBaseline />
      <div className="bg-black mx-auto p-4" style={{ maxWidth: '100%', padding: '16px 16px' }}>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-4">
          <div className="box p-2 border rounded bg-gray-100">
            <TotalVisitedPlaces />
          </div>
          <div className="box p-2 border rounded bg-gray-100">
            <TotalNights />
          </div>
          <div className="box p-2 border rounded bg-gray-100">
            <LongestTrip />
          </div>
          <div className="box p-2 border rounded bg-gray-100">
            <LongestPause />
          </div>
        </div>

        {/* Zwei Boxen */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-4 mb-4">
        <div className="box border rounded bg-gray-100 col-span-2" style={{ height: '40vh' }}>
          <div className="box border rounded bg-gray-100" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {!isLoading && <Map data={data} fullHeight={false} />}
          </div>
        </div>



          <div className="box border rounded bg-gray-100 col-span-2">
          <VisitsPerYear />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4"> 
          <div className="box p-2 border rounded bg-gray-100">
            <MostNightsPlace />
            <MostVisitedPlaces />
          </div>
          <div className="box p-2 border rounded bg-gray-100">
            <SeasonAnalysis />
            <PopularMonth />
          </div>
          <div className="box p-2 border rounded bg-gray-100">
            <AverageNightsPerPlace />
          </div>
          <div className="box p-2 border rounded bg-gray-100">
            <TotalKilometers />
          </div>
        </div>
        {/* Drei Boxen */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <div className="box p-2 border rounded bg-gray-100 col-span-2">
            <CountryPlaces />
          </div>
          <div className="box p-2 border rounded bg-gray-100 col-span-2">
            <NewPlacesPerYear />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 box p-2 border rounded bg-gray-100">
            <KilometersPerYear />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">

          <div className="box p-2 border rounded bg-gray-100 col-span-2">
            <DuplicateTitles />
          </div>
          <div className="box border rounded bg-gray-100 col-span-2">
            <div className="box border rounded bg-gray-100 col-span-2" style={{ height: '40vh' }}>
             <VisitsPerCountry />
            </div> 
          </div>
        </div>

        {/* Weitere Boxen */}
        


      </div>
    </GeistProvider>
  );
};

export default Stats;
