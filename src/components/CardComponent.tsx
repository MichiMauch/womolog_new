import React, { useState } from 'react';
import Weather from './Weather'; // Importiere die Wetter-Komponente
import MapIcon from '@mui/icons-material/Map'; // Importiere das Icon für die Karte
import AttractionsIcon from '@mui/icons-material/Attractions'; // Importiere das Icon für die Attraktionen
import { Place } from '../app/page'; // Importiere das Place-Interface
import MapModal from './ModalKomponente'; // Importiere die Modal-Komponente für die Karte
import SecondChildModal from './SecondChildModal'; // Importiere das SecondChildModal

interface CardProps {
  places: Place[];
}

const BentoGrid: React.FC<CardProps> = ({ places }) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [isSecondChildModalOpen, setSecondChildModalOpen] = useState(false);

  const openMapModal = (place: Place) => {
    setSelectedPlace(place);
    setMapModalOpen(true);
  };

  const closeMapModal = () => {
    setMapModalOpen(false);
    setSelectedPlace(null);
  };

  const openSecondChildModal = (place: Place) => {
    setSelectedPlace(place);
    setSecondChildModalOpen(true);
  };

  const closeSecondChildModal = () => {
    setSecondChildModalOpen(false);
    setSelectedPlace(null);
  };

  return (
    <div className="bg-blue-50 pt-6 pb-12 sm:pt-6 sm:pb-12">
      <div className="mx-auto px-6 lg:px-8">
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-8 lg:grid-cols-12">
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
              <div key={index} className={`relative group overflow-hidden duration-500 rounded-lg cursor-pointer ${colSpan}`}>
                {/* Bild mit Wellen-Effekt beim Hover */}
                <img
                  alt={place.title}
                  src={place.imageLinks}
                  className="rounded-lg w-full h-80 object-cover object-center transition-transform duration-500 group-hover:animate-wave"
                />
                <div className="rounded-lg absolute inset-0 flex flex-col justify-end">
                  <div className="rounded-b-lg absolute bg-white shadow-md -bottom-15 w-full p-4 flex flex-col gap-2 group-hover:bottom-0 group-hover:duration-700 duration-500">
                    <div>
                      <p className="mb-1 text-lg/7 font-medium tracking-tight text-gray-950 flex items-center">
                        {place.title}
                        {/* Flagge wird nur auf Desktop hinter dem Titel angezeigt */}
                        <img
                          src={`https://flagcdn.com/w320/${place.country_code.toLowerCase()}.png`}
                          alt={`${place.country} flag`}
                          className="ml-2 h-6 w-8 hidden sm:inline"  
                        />
                      </p>

                      {/* Location und Flagge auf mobilen Geräten */}
                      <div className="flex items-center">
                        <p className="text-sm/6 text-gray-600">{place.location}</p>
                        {/* Flagge wird auf mobilen Geräten hinter dem Location-Text angezeigt */}
                        <img
                          src={`https://flagcdn.com/w320/${place.country_code.toLowerCase()}.png`}
                          alt={`${place.country} flag`}
                          className="ml-2 h-4 w-6 block sm:hidden"  
                        />
                      </div>

                      <p className="text-sm/6 text-gray-600">{place.dateFrom} - {place.dateTo}</p>
                    </div>
                    <div className="flex justify-between">
                      <div className="absolute top-2 right-2">
                        <Weather latitude={place.latitude} longitude={place.longitude} />
                      </div>
                    </div>
                    <div className="border-t border-gray-200 -mb-4 -mx-4">
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="flex w-0 flex-1">
                          <a
                            href="#"
                            onClick={() => openMapModal(place)}
                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          >
                            <MapIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            Standort
                          </a>
                        </div>
                        <div className="-ml-px flex w-0 flex-1">
                          <a
                            href="#"
                            onClick={() => openSecondChildModal(place)}
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          >
                            <AttractionsIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            Attraktionen
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlace && (
        <MapModal
          latitude={selectedPlace.latitude}
          longitude={selectedPlace.longitude}
          open={isMapModalOpen}
          handleClose={closeMapModal}
          showZoomControl={true}
        />
      )}

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
