import React, { useEffect, useState } from 'react';
import { Modal, Box, CircularProgress, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    [key: string]: string;
  };
}

interface SecondChildModalProps {
  latitude: number;
  longitude: number;
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  outline: 0,
  borderRadius: '8px',
  p: 2,
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  marginTop: '10px',
  paddingRight: '15px',
};

const listItemStyle = {
  marginBottom: '4px',
};

const listStyle = {
  paddingLeft: '20px',
  margin: 0,
  listStyleType: 'disc',
};

const SecondChildModal: React.FC<SecondChildModalProps> = ({ latitude, longitude, open, handleClose }) => {
  const [places, setPlaces] = useState<OverpassElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetch(`/api/secondModalPlaces?latitude=${latitude}&longitude=${longitude}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data: OverpassElement[]) => {
          const filteredData = Array.from(
            new Map(
              data
                .filter(
                  (place) =>
                    place.tags?.name &&
                    place.tags.name !== 'Unbenannte Stelle' &&
                    !/^\d+$/.test(place.tags.name) &&
                    !/^\d+[a-zA-Z]{1,4}$/.test(place.tags.name)
                )
                .map((place) => [place.tags?.name + place.type, place])
            ).values()
          );
          setPlaces(filteredData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    }
  }, [latitude, longitude, open]);

  const groupedPlaces = places.reduce<{ [key: string]: OverpassElement[] }>((acc, place) => {
    const category =
      place.tags?.route
        ? `Route: ${place.tags.route}`
        : place.tags?.tourism
        ? `Art: ${place.tags.tourism}`
        : 'Andere';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(place);
    return acc;
  }, {});

  const categoryTitles: { [key: string]: string } = {
    'Art: attraction': 'Attraktionen',
    'Route: hiking': 'Wanderungen',
    'Route: bicycle': 'Fahrrad',
    'Route: mtb': 'Mountainbike',
  };

  const orderedCategories = ['Route: hiking', 'Route: bicycle', 'Route: mtb', 'Art: attraction'];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="second-child-modal-title"
      aria-describedby="second-child-modal-description"
      BackdropProps={{
        style: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: -15,
            right: -15,
            zIndex: 1000,
            color: 'white',
            backgroundColor: 'black',
            borderRadius: '50%',
            border: '3px solid white',
            '&:hover': {
              backgroundColor: 'gray',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography id="second-child-modal-title" variant="h6" component="h2">
          Aktivitäten und Attraktionen
        </Typography>
        <Box sx={contentStyle}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            orderedCategories.map((category) =>
              groupedPlaces[category] ? (
                <Box key={category} sx={{ mb: 4 }}>
                  <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                    {categoryTitles[category] || category}
                  </Typography>
                  <ul style={listStyle}>
                    {groupedPlaces[category].map((place) => (
                      <li key={place.id} style={listItemStyle}>
                      <Typography variant="subtitle1" component="span">
                        {place.tags?.name}
                      </Typography>
                    </li>
                    ))}
                  </ul>
                </Box>
              ) : null
            )
          )}
        </Box>
        <style jsx global>{`
          ul {
            padding-left: 20px;
          }

          ul li::marker {
            content: '•';
          }

          ul li::before {
            content: none;
          }

          ul li {
            padding-left: 8px; // Dies fügt den Abstand zwischen Punkt und Text hinzu
          }
        `}</style>
      </Box>
    </Modal>
  );
};

export default SecondChildModal;
