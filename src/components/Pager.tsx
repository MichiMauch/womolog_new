import React from 'react';

interface PagerProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pager({ currentPage, totalItems, itemsPerPage, onPageChange }: PagerProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 5; // Anzahl der Seiten, die angezeigt werden sollen
  const halfRange = Math.floor(maxPagesToShow / 2);

  // Berechnung der sichtbaren Seiten
  let startPage = Math.max(1, currentPage - halfRange);
  let endPage = Math.min(totalPages, currentPage + halfRange);

  // Korrigiere den Bereich, wenn wir am Anfang oder Ende der Liste sind
  if (currentPage <= halfRange) {
    endPage = Math.min(totalPages, maxPagesToShow);
  } else if (currentPage + halfRange >= totalPages) {
    startPage = Math.max(1, totalPages - maxPagesToShow + 1);
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrollt sanft nach oben
    }
  };

  return (
    <nav aria-label="Pagination" className="bg-blue-50 px-4 py-3 sm:px-6">
      <div className="flex flex-col items-center space-y-2">
        {/* Buttons für die Pagination */}
        <div className="flex justify-center space-x-2">
          {/* Button zur ersten Seite */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`bg-white relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-blue-50'
            } ring-1 ring-inset ring-gray-300`}
          >
            Erste
          </button>

          {/* Button für eine Seite zurück */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-white relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-blue-50'
            } ring-1 ring-inset ring-gray-300`}
          >
            &lt;
          </button>

          {/* Seitenzahlen anzeigen */}
          {/* Seitenzahlen anzeigen */}
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
            const page = startPage + index;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
                  page === currentPage ? 'bg-blue-900 text-white' : 'bg-white text-gray-900 hover:bg-blue-50'
                } ring-1 ring-inset ring-gray-300`}
              >
                {page}
              </button>
            );
          })}

          {/* Button für eine Seite vor */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`bg-white relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-blue-50'
            } ring-1 ring-inset ring-gray-300`}
          >
            &gt;
          </button>

          {/* Button zur letzten Seite */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`bg-white relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-blue-50'
            } ring-1 ring-inset ring-gray-300`}
          >
            Letzte
          </button>
        </div>

        {/* Text für die Seitenzahlen */}
        <p className="text-sm text-gray-700">
          Orte Nr. <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> bis{' '}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> von total{' '}
          <span className="font-medium">{totalItems}</span>
        </p>
      </div>
    </nav>
  );
}
