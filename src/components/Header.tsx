import React from 'react';
import TotalVisitedPlaces from '../components/TotalVisitedPlaces'; // Pfad anpassen, falls notwendig
import TotalNights from '../components/TotalNights'; // Pfad anpassen, falls notwendig
import TotalKilometersStart from '../components/TotalDistanceStart'; // Pfad anpassen, falls notwendig
import AverageNightsPerPlace from '../components/AverageNightsPerPlace'; // Pfad anpassen, falls notwendig

const stats = [
  { id: 'total-places', value: <TotalVisitedPlaces /> },
  { id: 'total-nights', value: <TotalNights /> },
  { id: 'total-km', value: <TotalKilometersStart /> },
  { id: 'season-analysis', value: <AverageNightsPerPlace /> },
];

const Header: React.FC = () => {
  return (
    <div className="relative isolate overflow-hidden bg-blue-50 pt-12 pb-0 sm:pt-12 sm:pb-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          {/* Textbereich */}
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">Discover our WomoLog!</h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">
            Unsere besuchten Stell-, Camping- und Parkplätze, an denen wir seit 2018 mindestens eine Nacht mit dem Camper verbracht haben.</p>          </div>
          
          {/* Boxen-Bereich */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-3 mt-10 lg:mt-0 lg:ml-10">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white flex flex-col items-start justify-start py-2 px-4 border border-gray-300 rounded-lg"
              >
                <dd className="text-2xl font-bold leading-9 tracking-tight text-black">
                  {stat.value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
