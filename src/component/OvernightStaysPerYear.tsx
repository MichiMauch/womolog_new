import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OvernightStaysPerYear = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Übernachtungen pro Jahr',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.').map(Number);
      return new Date(year, month - 1, day);
    };

    const fetchData = async () => {
      const response = await fetch('/api/sheetData');
      const sheetData = await response.json();
      const overnightStays: { [year: string]: number } = {};

      sheetData.forEach(([, , dateFrom, dateTo]: [string, string, string, string], index) => {
        const fromDate = parseDate(dateFrom);
        const toDate = parseDate(dateTo);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          console.error(`Invalid date format: ${dateFrom} - ${dateTo}`);
          return;
        }

        // Calculate the number of nights
        const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));

        console.log(`Processing: ${dateFrom} - ${dateTo} | Nights: ${nights} | Index: ${index}`);

        for (let year = fromDate.getFullYear(); year <= toDate.getFullYear(); year++) {
          if (year === fromDate.getFullYear() && year === toDate.getFullYear()) {
            // Both dates in the same year
            overnightStays[year] = (overnightStays[year] || 0) + nights;
          } else if (year === fromDate.getFullYear()) {
            // First year
            const endOfYear = new Date(year, 11, 31);
            const nightsInYear = Math.ceil((endOfYear.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
            overnightStays[year] = (overnightStays[year] || 0) + nightsInYear;
          } else if (year === toDate.getFullYear()) {
            // Last year
            const startOfYear = new Date(year, 0, 1);
            const nightsInYear = Math.ceil((toDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
            overnightStays[year] = (overnightStays[year] || 0) + nightsInYear;
          } else {
            // Full years in between
            const nightsInYear = Math.ceil((new Date(year, 11, 31).getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
            overnightStays[year] = (overnightStays[year] || 0) + nightsInYear;
          }
        }
      });

      console.log('Overnight Stays:', overnightStays);

      const labels = Object.keys(overnightStays).sort();
      const data = labels.map(year => overnightStays[year]);
      const totalOvernightStays = data.reduce((sum, value) => sum + value, 0);

      console.log('Total Overnight Stays:', totalOvernightStays);

      setChartData({
        labels: [...labels, 'Total'],
        datasets: [
          {
            label: 'Übernachtungen pro Jahr',
            data: [...data, totalOvernightStays],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return <Bar data={chartData} />;
};

export default OvernightStaysPerYear;
