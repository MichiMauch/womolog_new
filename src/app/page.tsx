"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GeistProvider, CssBaseline, Modal, Text, Button } from '@geist-ui/core';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the default icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Place {
  title: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  imageLinks: string;
  latitude: number;
  longitude: number;
}

const CenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

export default function Home() {
  const [data, setData] = useState<Place[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    // Check if running in browser before accessing window or document
    if (typeof window !== 'undefined') {
      // Erzwinge den Dark Mode
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
    const filename = segments[segments.length - 1]; // letzter Teil des Pfads
    const baseName = filename.split('.')[0]; // Entferne die Erweiterung
    return baseName ? `https://pub-7b46ce1a4c0f4ff6ad2ed74d56e2128a.r2.dev/${baseName}.webp` : '';
  };

  const openModal = (place: Place) => {
    setSelectedPlace(place);
    setIsVisible(true);
  };

  return (
    <GeistProvider>
      <CssBaseline />
      <Head>
        <title>Womolog</title>
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4 dark:bg-black dark:text-white">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex h-[calc(100vh-2rem)] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 p-4 text-center text-white shadow-highlight lg:row-span-2 dark:bg-gray-900 dark:text-gray-100">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
              2024 Event Photos
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Our incredible Next.js community got together for our first ever in-person conference!
            </p>
            <a
              className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
              href="https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary&project-name=nextjs-image-gallery&repository-name=with-cloudinary&env=NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,CLOUDINARY_FOLDER&envDescription=API%20Keys%20from%20Cloudinary%20needed%20to%20run%20this%20application"
              target="_blank"
              rel="noreferrer"
            >
              Clone and Deploy
            </a>
          </div>
          {data.map((place, index) => (
            <div
              key={index}
              className="relative block w-full cursor-pointer rounded-lg shadow-md dark:bg-gray-900 dark:text-gray-100"
              style={{ height: 'calc(50vh - 1rem)' }}
              onClick={() => openModal(place)}
            >
              <div className="relative h-full w-full transform rounded-lg brightness-90 transition will-change-auto hover:brightness-110">
                <img
                  alt={place.title}
                  className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  src={place.imageLinks}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 rounded-lg"></div>
                <div className="absolute bottom-0 p-4 rounded-lg">
                  <p className="text-gray-300">{place.title}</p>
                  <p className="text-gray-300">{place.location}</p>
                  <p className="text-gray-300">{place.dateFrom} - {place.dateTo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12 dark:text-gray-100">
        Thank you to{" "}
        <a
          href="https://edelsonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white dark:hover:text-gray-300"
          rel="noreferrer"
        >
          Josh Edelson
        </a>
        ,{" "}
        <a
          href="https://www.newrevmedia.com/"
          target="_blank"
          className="font-semibold hover:text-white dark:hover:text-gray-300"
          rel="noreferrer"
        >
          Jenny Morgan
        </a>
        , and{" "}
        <a
          href="https://www.garysextonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white dark:hover:text-gray-300"
          rel="noreferrer"
        >
          Gary Sexton
        </a>{" "}
        for the pictures.
      </footer>
      {selectedPlace && (
        <Modal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          className="fixed inset-0 flex items-center justify-center p-4 w-3/4"
        >
          <div className="bg-white p-4 rounded-lg dark:bg-gray-800 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-4">{selectedPlace.title}</h2>
            <p><strong>Location:</strong> {selectedPlace.location}</p>
            <p><strong>Date:</strong> {selectedPlace.dateFrom} - {selectedPlace.dateTo}</p>
            <p><strong>Coordinates:</strong> {selectedPlace.latitude}, {selectedPlace.longitude}</p>
            <div className="mt-4" style={{ height: '300px' }}>
              
            </div>
          </div>
        </Modal>
      )}
    </GeistProvider>
  );
}
