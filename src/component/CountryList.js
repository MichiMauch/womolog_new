// components/CountryList.js
import React, { useEffect, useState } from 'react';
import { getUniqueCountries } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const CountryList = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const uniqueCountries = getUniqueCountries(data);
        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (countries.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Länder, die ich besucht habe</h2>
      <ul>
        {countries.map((country, index) => (
          <li key={index}>{country}</li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
