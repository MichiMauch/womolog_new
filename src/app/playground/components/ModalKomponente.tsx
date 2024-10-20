import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../../../components/map'), {
  ssr: false,
});

interface MapModalProps {
  latitude: number;
  longitude: number;
  open: boolean;
  handleClose: () => void;
  showZoomControl?: boolean;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50rem',
  bgcolor: 'background.paper',
  boxShadow: 24,
  outline: 0,
  borderRadius: '8px',
  p: 0,
};

const contentStyle = {
  position: 'relative',
  borderRadius: '8px',
  padding: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
};

const MapModal: React.FC<MapModalProps> = ({ latitude, longitude, open, handleClose, showZoomControl = true }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        style: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <Box sx={{ ...style, width: '90%', maxWidth: '50rem', position: 'relative' }}>
        <Box sx={contentStyle}>
          <div className="relative w-full h-96 rounded-lg bg-cover bg-center">
            <MapComponent latitude={latitude} longitude={longitude} enableClick={true} fullSize={true} showZoomControl={showZoomControl} />
          </div>

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
        </Box>
      </Box>
    </Modal>
  );
};

export default MapModal;
