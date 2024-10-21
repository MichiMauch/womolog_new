"use client";
import React, { useEffect, useState, useCallback } from 'react';
import BentoGrid from '../components/CardComponent'; // Importiere die BentoGrid-Komponente
import Pager from '../components/Pager'; // Importiere die Pager-Komponente
import Header from '../components/Header'; // Pfad anpassen
import Footer from '../components/Footer'; // Importiere den Footer
import Spinner from '../components/Spinner'; // Importiere die Spinner-Komponente

export interface Place {
  title: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  imageLinks: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
}

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredData, setFilteredData] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Zustand, um zu erkennen, ob wir im Client sind
  const [currentPage, setCurrentPage] = useState(1); // Aktuelle Seite für Pagination
  const itemsPerPage = 14; // Anzahl der Elemente pro Seite

  useEffect(() => {
    // Markiere den Client, sobald der Code im Browser ausgeführt wird
    setIsClient(true);
  }, []);

  const convertDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const convertCloudflareLink = (link: string) => {
    const segments = link.split('/');
    const filename = segments[segments.length - 1];
    const baseName = filename.split('.')[0];
    return baseName ? `https://pub-7b46ce1a4c0f4ff6ad2ed74d56e2128a.r2.dev/${baseName}.webp` : '';
  };

  const fetchData = useCallback(() => {
    fetch('/api/sheetData') // Die korrekte API für das Laden der Daten
      .then((response) => {
        if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json();
      })
      .then((data) => {
        const formattedData: Place[] = data.map((row: any[]) => ({
          title: row[0],
          location: row[1],
          dateFrom: row[2],
          dateTo: row[3],
          imageLinks: row[4] ? convertCloudflareLink(row[4]) : '',
          latitude: parseFloat(row[5]),
          longitude: parseFloat(row[6]),
          country: row[7],
          country_code: row[8],
        }));
        const sortedData = formattedData.sort((a, b) => convertDate(b.dateFrom).getTime() - convertDate(a.dateFrom).getTime());
        setPlaces(sortedData);
        setFilteredData(sortedData); // Initialize filteredData with all data
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Daten:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Verhindere das Rendern des UI im Serverzustand, bis der Client erkannt wurde
  if (!isClient) {
    return <div className="min-h-screen flex flex-col justify-between" />; // Leeres Div um Sprünge zu vermeiden
  }

  // Zeige den Spinner an, während die Daten geladen werden
  if (isLoading) {
    return <Spinner />;
  }

  // Wenn alles geladen ist, zeige den eigentlichen Inhalt
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <BentoGrid places={paginatedData} />
        <Pager
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer /> {/* Footer immer unten fixiert */}
    </div>
  );
}
