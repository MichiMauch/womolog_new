import React, { useState } from 'react';
import Weather from '../../../components/Weather'; // Importiere die Wetter-Komponente
import MapIcon from '@mui/icons-material/Map'; // Importiere das Icon für die Karte
import AttractionsIcon from '@mui/icons-material/Attractions'; // Importiere das Icon für die Attraktionen
import { Place } from '../page'; // Importiere das Place-Interface
import MapModal from './ModalKomponente'; // Importiere die Modal-Komponente für die Karte
import SecondChildModal from '../../../components/SecondChildModal'; // Importiere das SecondChildModal

interface CardProps {
  places: Place[];
}

const BentoGrid: React.FC<CardProps> = ({ places }) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [isSecondChildModalOpen, setSecondChildModalOpen] = useState(false);

  // Funktion zum Öffnen des Kartenmodals
  const openMapModal = (place: Place) => {
    setSelectedPlace(place);
    setMapModalOpen(true);
  };

  // Funktion zum Schließen des Kartenmodals
  const closeMapModal = () => {
    setMapModalOpen(false);
    setSelectedPlace(null);
  };

  // Funktion zum Öffnen des SecondChildModals
  const openSecondChildModal = (place: Place) => {
    setSelectedPlace(place);
    setSecondChildModalOpen(true);
  };

  // Funktion zum Schließen des SecondChildModals
  const closeSecondChildModal = () => {
    setSecondChildModalOpen(false);
    setSelectedPlace(null);
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto px-6 lg:px-8">
        <h2 className="text-base/7 font-semibold text-indigo-600 whitespace-nowrap">womolog.ch</h2>
        <p className="mt-2 text-pretty text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl whitespace-nowrap overflow-hidden border-r-2 border-white">
          Discover all our favorite locations.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-12">
          {places.map((place, index) => {
            const layoutPosition = index % 7;
            const isReversedLayout = Math.floor(index / 7) % 2 === 1;

            let colSpan = '';

            if (layoutPosition < 2) {
              colSpan = 'lg:col-span-6';
            } else if (layoutPosition >= 2 && layoutPosition < 5) {
              colSpan = 'lg:col-span-4';
            } else if (layoutPosition === 5) {
              colSpan = isReversedLayout ? 'lg:col-span-4' : 'lg:col-span-8';
            } else if (layoutPosition === 6) {
              colSpan = isReversedLayout ? 'lg:col-span-8' : 'lg:col-span-4';
            }

            return (
                <div key={index} className={`relative group overflow-hidden duration-500 cursor-pointer ${colSpan}`}>
                <img
                  alt={place.title}
                  src={place.imageLinks}
                  className="w-full h-80 object-cover object-center"
                />
                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="absolute bg-gray-50 -bottom-15 w-full p-4 flex flex-col gap-2 group-hover:bottom-0 group-hover:duration-700 duration-500">
                    <div>
                      {/* Titel und Flagge */}
                      <p className="mb-1 text-lg/7 font-medium tracking-tight text-gray-950 flex items-center">
                        {place.title}
                        <img
                          src={`https://flagcdn.com/w320/${place.country_code.toLowerCase()}.png`}
                          alt={`${place.country} flag`}
                          className="ml-2 h-6 w-8"
                        />
                      </p>
                      {/* Ort und Datum direkt unter dem Titel */}
                      <p className="text-sm/6 text-gray-600">{place.location}</p>
                      <p className="text-sm/6 text-gray-600">{place.dateFrom} - {place.dateTo}</p>
                    </div>
                    <div className="flex justify-between">
                      {/* Wetterkomponente rechts oben */}
                      <div className="absolute top-2 right-2">
                        <Weather latitude={place.latitude} longitude={place.longitude} />
                      </div>
                    </div>
                    {/* Buttons für Karte und Attraktionen */}
                    <div className="flex w-full mt-4 gap-2">
                      <button
                        className="w-full text-gray-700 py-2 border border-gray-300 flex items-center justify-center"
                        onClick={() => openMapModal(place)}
                      >
                        <MapIcon className="mr-2" />
                        Standort
                      </button>
                      <button
                        className="w-full text-gray-700 py-2 border border-gray-300 flex items-center justify-center"
                        onClick={() => openSecondChildModal(place)}
                      >
                        <AttractionsIcon className="mr-2" />
                        Attraktionen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
            );
          })}
        </div>
      </div>

      {/* Map Modal anzeigen, wenn ein Ort ausgewählt ist */}
      {selectedPlace && (
        <MapModal
          latitude={selectedPlace.latitude}
          longitude={selectedPlace.longitude}
          open={isMapModalOpen}
          handleClose={closeMapModal}
          showZoomControl={true}
        />
      )}

      {/* AttraktionenModal anzeigen, wenn ein Ort ausgewählt ist */}
      {selectedPlace && (
        <SecondChildModal
          open={isSecondChildModalOpen}
          handleClose={closeSecondChildModal}
          latitude={selectedPlace.latitude}
          longitude={selectedPlace.longitude}
        />
      )}
    </div>
  );
};

export default BentoGrid;
