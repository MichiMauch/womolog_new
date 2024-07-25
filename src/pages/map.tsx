import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { CircularProgress, Box } from '@mui/material';
import styles from './MapPage.module.css'; // Importieren des CSS-Moduls

// Dynamisches Importieren der Karte
const Map = dynamic(() => import('../components/LeafletMap'), { ssr: false });

const MapPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const result = await response.json();
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <Map data={data} fullHeight={true} />
    </div>
  );
};

export default MapPage;