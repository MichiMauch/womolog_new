import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement);

const VisitsPerYearChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerYear } = calculateStatistics(data);

        const labels = Object.keys(visitsPerYear);
        const visitCounts = Object.values(visitsPerYear).map(item => item.visitCount);
        const nightsCounts = Object.values(visitsPerYear).map(item => item.nights);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Orte',
              data: visitCounts,
              backgroundColor: '#67BFFF', // Neue Farbe
              borderColor: '#67BFFF', 
              borderWidth: 1,
              borderRadius: 5, // Oben abgerundete Ecken
              categoryPercentage: 0.5, // Vergrößert den Abstand zwischen den Balken
              barPercentage: 0.8, // Schmalere Balken
            },
            {
              label: 'Nächte',
              data: nightsCounts,
              backgroundColor: '#8470FF', // Neue Farbe
              borderColor: '#8470FF', 
              borderWidth: 1,
              borderRadius: 5, // Oben abgerundete Ecken
              categoryPercentage: 0.5, // Vergrößert den Abstand zwischen den Balken
              barPercentage: 0.8, // Schmalere Balken
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  const customLegend = (chartData) => {
    const { datasets } = chartData;
    if (!datasets) return null;
    return (
      <div className="flex space-x-4">
        {datasets.map((dataset, index) => (
          <div key={index} className="flex items-center">
            <span
              style={{
                display: 'block',
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '9999px',
                marginRight: '0.5rem',
                borderWidth: '3px',
                borderColor: dataset.borderColor,
                pointerEvents: 'none',
                backgroundColor: 'white',
              }}
            ></span>
            <span className="ml-2 text-black text-4xl font-semibold">{dataset.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white">
      <div className="text-gray-500 text-sm mb-1">Orte und Übernachtungen pro Jahr</div>
      <div id="legend-container" className="mt-1">
        {customLegend(chartData)}
      </div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
              onClick: (e) => e.stopPropagation(),
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false,
                drawBorder: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value, index) {
                  // Nur jeden zweiten Tick anzeigen
                  if (index % 2 === 0) {
                    return value;
                  }
                  return '';
                },
              },
              grid: {
                color: function (context) {
                  // Nur jede zweite Linie anzeigen
                  if (context.index % 2 === 0) {
                    return 'rgba(0, 0, 0, 0.05)'; // Hellere Farbe für die Linie
                  }
                  return 'rgba(0, 0, 0, 0)';
                },
                drawBorder: false,
              },
              border: {
                display: false,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default VisitsPerYearChart;
