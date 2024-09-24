import React from 'react';

interface PagerProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pager({ currentPage, totalItems, itemsPerPage, onPageChange }: PagerProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrollt sanft nach oben
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Orte Nr. <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> bis{' '}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> von total{' '}
          <span className="font-medium">{totalItems}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end space-x-2">
        {/* Button zur ersten Seite */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50'
          } ring-1 ring-inset ring-gray-300`}
        >
          Erste
        </button>

        {/* Button für vorherige Seite */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50'
          } ring-1 ring-inset ring-gray-300`}
        >
          Vorherige
        </button>

        {/* Button für nächste Seite */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50'
          } ring-1 ring-inset ring-gray-300`}
        >
          Nächste
        </button>

        {/* Button zur letzten Seite */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50'
          } ring-1 ring-inset ring-gray-300`}
        >
          Letzte
        </button>
      </div>
    </nav>
  );
}
