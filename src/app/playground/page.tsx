"use client";
import React, { useEffect, useState, useCallback } from 'react';
import BentoGrid from './components/CardComponent'; // Importiere die BentoGrid-Komponente
import Pager from '../../components/Pager'; // Importiere die Pager-Komponente
import Navbar from './components/Navbar'; // Importiere die Navbar-Komponente
import Footer from './components/Footer';



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
  const [currentPage, setCurrentPage] = useState(1); // Aktuelle Seite für Pagination
  const itemsPerPage = 14; // Anzahl der Elemente pro Seite

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

  if (isLoading) {
    return <p>Daten werden geladen...</p>; // Loading-Zustand
  }

  return (
    <div className="bg-black min-h-screen"> {/* Hintergrund schwarz */}
      <Navbar /> {/* Nutze die Navbar hier */}
      <BentoGrid places={paginatedData} />
      <Pager
        currentPage={currentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
      <Footer />
    </div>
  );
}
