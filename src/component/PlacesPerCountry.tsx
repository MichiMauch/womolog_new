import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

interface CountryData {
  countryCode: string;
  countryName: string;
  overnightStays: number;
  placesCount: number;
}

const PlacesPerCountry = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [totalOvernightStays, setTotalOvernightStays] = useState(0);
  const [totalPlacesCount, setTotalPlacesCount] = useState(0);

  const calculateOvernightStays = (dateFrom: string, dateTo: string): number => {
    const [fromDay, fromMonth, fromYear] = dateFrom.split('.').map(Number);
    const [toDay, toMonth, toYear] = dateTo.split('.').map(Number);
    const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
    const toDate = new Date(toYear, toMonth - 1, toDay);
    const timeDiff = toDate.getTime() - fromDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/sheetData');
      const sheetData = await response.json();
      const countryData: { [key: string]: CountryData } = {};

      sheetData.forEach(([title, location, dateFrom, dateTo, , , , country, countryCode]: [string, string, string, string, string, number, number, string, string], index) => {
        const overnightStays = calculateOvernightStays(dateFrom, dateTo);
        if (!countryData[countryCode]) {
          countryData[countryCode] = { countryCode, countryName: country, overnightStays, placesCount: 1 };
        } else {
          countryData[countryCode].overnightStays += overnightStays;
          countryData[countryCode].placesCount += 1;
        }
        console.log(`Processing: ${dateFrom} - ${dateTo} | Nights: ${overnightStays} | Index: ${index}`);
      });

      const countryArray = Object.values(countryData).sort((a, b) => b.overnightStays - a.overnightStays);
      const totalStays = countryArray.reduce((sum, country) => sum + country.overnightStays, 0);
      const totalPlaces = countryArray.reduce((sum, country) => sum + country.placesCount, 0);

      console.log('Total Overnight Stays:', totalStays);
      console.log('Total Places Count:', totalPlaces);

      setCountries([...countryArray, { countryCode: 'total', countryName: 'Total', overnightStays: totalStays, placesCount: totalPlaces }]);
      setTotalOvernightStays(totalStays);
      setTotalPlacesCount(totalPlaces);
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Orte und Übernachtungen pro Land</Typography>
      <div>
        {countries.map(({ countryCode, countryName, overnightStays, placesCount }) => (
          <div key={countryCode} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            {countryCode !== 'total' ? (
              <img
                src={`https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`}
                alt={`${countryName} flag`}
                style={{ marginRight: '10px', width: '24px', height: '18px' }}
              />
            ) : null}
            <Typography variant="body1">
              {countryName}: {placesCount} Orte, {overnightStays} Nächte
            </Typography>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default PlacesPerCountry;
