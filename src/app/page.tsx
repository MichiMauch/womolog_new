import React, { useState } from 'react';
import BentoGrid from '../components/CardComponent'; // Importiere die BentoGrid-Komponente
import Pager from '../components/Pager'; // Importiere die Pager-Komponente
import Header from '../components/Header'; // Pfad anpassen
import Footer from '../components/Footer'; // Importiere den Footer
import Spinner from '../components/Spinner'; // Importiere die Spinner-Komponente
import { getSheetData } from '../../lib/googleSheets'; // Importiere deine Funktion für den Datenabruf

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

interface HomeProps {
  places: Place[];
}

export default function Home({ places }: HomeProps) {
  const [currentPage, setCurrentPage] = useState(1); // Aktuelle Seite für Pagination
  const itemsPerPage = 14; // Anzahl der Elemente pro Seite

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = places.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <BentoGrid places={paginatedData} />
        <Pager
          currentPage={currentPage}
          totalItems={places.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
}

// Verwende getStaticProps, um Daten serverseitig zu laden
export async function getStaticProps() {
  const rows = await getSheetData();

  // Verarbeite die Daten, um das Format für deine Komponente zu erstellen
  const convertCloudflareLink = (link: string) => {
    const segments = link.split('/');
    const filename = segments[segments.length - 1];
    const baseName = filename.split('.')[0];
    return baseName ? `https://pub-7b46ce1a4c0f4ff6ad2ed74d56e2128a.r2.dev/${baseName}.webp` : '';
  };

  const formattedData: Place[] = rows.map((row: any[]) => ({
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

  const sortedData = formattedData.sort((a, b) => new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime());

  return {
    props: {
      places: sortedData, // übergib die Daten an die Komponente
    },
    revalidate: 600, // ISR: Seite wird alle 10 Minuten neu generiert
  };
}
