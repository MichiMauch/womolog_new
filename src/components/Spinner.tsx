import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-50">
      {/* Großes Text-Logo oberhalb des Spinners */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">womolog.ch</h1>
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
      {/* Text unterhalb des Spinners */}
      <h2 className="text-xl font-semibold text-gray-700">Logbuch wird geöffnet...</h2>
    </div>
  );
};

export default Spinner;
