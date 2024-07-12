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

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const PlacesPerYear = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Plätze pro Jahr',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
      const placesPerYear: { [year: string]: Set<string> } = {};

      sheetData.forEach(([title, , dateFrom, dateTo]: [string, string, string, string]) => {
        const fromDate = parseDate(dateFrom);
        const toDate = parseDate(dateTo);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          console.error(`Invalid date format: ${dateFrom} - ${dateTo}`);
          return;
        }

        const years = [];
        for (let year = fromDate.getFullYear(); year <= toDate.getFullYear(); year++) {
          years.push(year);
        }

        years.forEach((year) => {
          if (!placesPerYear[year]) {
            placesPerYear[year] = new Set();
          }
          placesPerYear[year].add(title);
        });
      });

      const labels = Object.keys(placesPerYear).sort();
      const data: number[] = labels.map((year) => placesPerYear[year].size);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Plätze pro Jahr',
            data: data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return <Bar data={chartData} />;
};

export default PlacesPerYear;
