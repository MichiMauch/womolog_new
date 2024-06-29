"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Modal, Box, Typography } from '@mui/material';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import MapComponent from '../comoponent/map';


interface Place {
  title: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  imageLinks: string;
  latitude: number;
  longitude: number;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50rem',
  bgcolor: 'background.paper',
  boxShadow: 24,
  outline: 0,
  borderRadius: '8px',
  p: 0, // No padding inside the modal box
};

const contentStyle = {
  position: 'relative',
  borderRadius: '8px',
  padding: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
};

export default function Home() {
  const [data, setData] = useState<Place[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
    }

    fetch('/api/sheetData')
      .then((response) => response.json())
      .then((data: any[][]) => {
        const formattedData: Place[] = data.map((row) => ({
          title: row[0],
          location: row[1],
          dateFrom: row[2],
          dateTo: row[3],
          imageLinks: row[4] ? convertCloudflareLink(row[4]) : '',
          latitude: parseFloat(row[5]),
          longitude: parseFloat(row[6]),
        }));
        setData(formattedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const convertCloudflareLink = (link: string) => {
    const segments = link.split('/');
    const filename = segments[segments.length - 1];
    const baseName = filename.split('.')[0];
    return baseName ? `https://pub-7b46ce1a4c0f4ff6ad2ed74d56e2128a.r2.dev/${baseName}.webp` : '';
  };

  const openModal = (place: Place) => {
    setSelectedPlace(place);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setSelectedPlace(null);
  };

  return (
    <GeistProvider>
      <CssBaseline />
      <Head>
        <title>Womolog</title>
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4 dark:bg-black dark:white">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex h-[calc(100vh-2rem)] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg p-4 text-center text-white lg:row-span-2 dark:bg-gray-900 dark:text-white bg-custom">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="absolute left-0 right-0 bottom-0 h-[400px]"></span>
            </div>
            <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
              womolog.ch<br />Unser Wohnmobil-Logbuch
            </h1>
            <p className="font-bold max-w-[40ch] text-white sm:max-w-[32ch]">
              Seit Juli 2018 sind wir mit unserem Wohnmobil unterwegs. Hier findest du all unsere Stationen,
              Campingplätze, Stellplätze und Versorgungsplätze welche wir besucht haben.
            </p>
          </div>
          {data.map((place, index) => (
            <div
              key={index}
              className="relative block w-full cursor-pointer rounded-lg shadow-md dark:bg-gray-900 dark:text-gray-100"
              style={{ height: 'calc(50vh - 1rem)' }}
              onClick={() => openModal(place)}
            >
              <div className="relative h-full w-full rounded-lg overflow-hidden">
                <img
                  alt={place.title}
                  className="absolute inset-0 h-full w-full object-cover transform transition-transform duration-500 ease-in-out hover:scale-105 rounded-lg"
                  src={place.imageLinks}
                />
                <div className="absolute bottom-0 p-4 rounded-lg">
                  <p className="text-white mb-1 font-bold">
                    {place.title} <br />{place.location}<br />{place.dateFrom} - {place.dateTo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12 dark:text-gray-100">
        <a
          href="https://www.michimauch.ch/"
          target="_blank"
          className="font-semibold hover:text-white dark:hover:text-gray-300"
          rel="noreferrer"
        >
          Michi & Sibylle Mauch
        </a>
      </footer>
      {selectedPlace && (
 <Modal
 open={isVisible}
 onClose={closeModal}
 aria-labelledby="modal-modal-title"
 aria-describedby="modal-modal-description"
 BackdropProps={{
   style: {
     backdropFilter: 'blur(10px)',
     backgroundColor: 'rgba(255, 255, 255, 0.2)',
   },
 }}
>
 <Box sx={{ ...style, width: '90%', maxWidth: '50rem', position: 'relative' }}>
   <Box sx={contentStyle}>
     <div
       className="relative w-full h-96 rounded-lg bg-cover bg-center"
       style={{ backgroundImage: `url(${selectedPlace.imageLinks})` }}
     >
       <div className="absolute bottom-0 left-0 z-10 p-4 bg-black bg-opacity-50 w-auto rounded-lg">
         <Typography id="modal-modal-title" variant="h6" component="h2" className="text-white">
           {selectedPlace.title}
         </Typography>
         <Typography id="modal-modal-description" className="text-white">
           {selectedPlace.location}<br />
           {selectedPlace.dateFrom} - {selectedPlace.dateTo}<br />
           {selectedPlace.latitude}, {selectedPlace.longitude}
         </Typography>
       </div>
     </div>
     <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 20 }}>
       {selectedPlace && (
         <MapComponent latitude={selectedPlace.latitude} longitude={selectedPlace.longitude} />
       )}
     </div>
   </Box>
 </Box>
</Modal>


      
      
      )}
    </GeistProvider>
  );
}
