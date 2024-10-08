import React, { useState, useEffect, useRef } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { German } from 'flatpickr/dist/l10n/de'; // Korrigierter Importpfad
import { styled } from '@mui/material/styles';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

interface CombinedFilterProps {
  countries: string[];
  onFilter: (startDate: Date | null, endDate: Date | null, country: string) => void;
  onReset: () => void;
  onClose: () => void;
}

const CustomOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    color: 'black',
    backgroundColor: 'white',
    borderRadius: '8px',
    appearance: 'none', // Remove native appearance
    '-webkit-appearance': 'none', // Remove native appearance for Safari
    '-moz-appearance': 'none', // Remove native appearance for Firefox
  },
  '& .MuiInputLabel-root': {
    color: 'black',
    backgroundColor: 'white',
    padding: '0 4px',
    transform: 'translate(14px, 12px) scale(1)', // Adjusted transformation
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)', // Adjusted transformation for shrinking
      fontSize: 'calc(0.75rem + 3px)', // Increased font size by 3px
    },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'white', // Set border color to white
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white', // Set focused border color to white
    },
    '& legend': {
      color: 'white', // Set legend text color to white
      fontSize: '1rem', // Adjust legend font size
    },
  },
}));

const flagUrls: { [key: string]: string } = {
  Schweiz: 'https://flagcdn.com/w320/ch.png',
  Deutschland: 'https://flagcdn.com/w320/de.png',
  Österreich: 'https://flagcdn.com/w320/at.png',
  Frankreich: 'https://flagcdn.com/w320/fr.png',
  Italien: 'https://flagcdn.com/w320/it.png',
  Dänemark: 'https://flagcdn.com/w320/dk.png',
  Luxemburg: 'https://flagcdn.com/w320/lu.png',

  // Weitere Länder hier hinzufügen
};

const CombinedFilter: React.FC<CombinedFilterProps> = ({ countries, onFilter, onReset, onClose }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [startFocused, setStartFocused] = useState(false);
  const [endFocused, setEndFocused] = useState(false);

  const startDatePickerRef = useRef<HTMLInputElement>(null);
  const endDatePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startDatePickerRef.current) {
      Flatpickr(startDatePickerRef.current, {
        onChange: (selectedDates) => setStartDate(selectedDates[0]),
        dateFormat: 'd.m.Y',
        locale: German, // Set locale to German
      });
    }

    if (endDatePickerRef.current) {
      Flatpickr(endDatePickerRef.current, {
        onChange: (selectedDates) => setEndDate(selectedDates[0]),
        dateFormat: 'd.m.Y',
        locale: German, // Set locale to German
      });
    }
  }, []);

  const handleFilter = () => {
    onFilter(startDate, endDate, selectedCountry);
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCountry('');
    if (startDatePickerRef.current) {
      startDatePickerRef.current.value = '';
    }
    if (endDatePickerRef.current) {
      endDatePickerRef.current.value = '';
    }
    onReset();
    onClose();
  };

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCountry(event.target.value as string);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: 'center',
        padding: '8px 1px 0 1px',
      }}
    >
      <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: '8px' }}>
        <InputLabel htmlFor="start-date-picker" shrink={startFocused || Boolean(startDate)}>
          Von
        </InputLabel>
        <CustomOutlinedInput
          inputRef={startDatePickerRef}
          id="start-date-picker"
          placeholder="Select start date"
          label="Von"
          onClick={() => {
            startDatePickerRef.current && startDatePickerRef.current.focus();
            setStartFocused(true);
          }}
          onBlur={() => setStartFocused(false)}
          endAdornment={
            <InputAdornment position="end">
              <EventNoteIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: '8px' }}>
        <InputLabel htmlFor="end-date-picker" shrink={endFocused || Boolean(endDate)}>
          Bis
        </InputLabel>
        <CustomOutlinedInput
          inputRef={endDatePickerRef}
          id="end-date-picker"
          placeholder="Select end date"
          label="Bis"
          onClick={() => {
            endDatePickerRef.current && endDatePickerRef.current.focus();
            setEndFocused(true);
          }}
          onBlur={() => setEndFocused(false)}
          endAdornment={
            <InputAdornment position="end">
              <EventNoteIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: '8px' }}>
        <InputLabel>Land</InputLabel>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          label="Land"
          renderValue={(selected) => {
            if (selected === "") {
              return <em>Alle</em>;
            }
            return selected;
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
              },
            },
          }}
        >
          <MenuItem value="" sx={{ marginLeft: '7px' }}>
            <em>Alle</em>
          </MenuItem>
          {countries.map((country, index) => (
            <MenuItem key={index} value={country} sx={{ display: 'flex', alignItems: 'center', listStyle: 'none', paddingLeft: 0 }}>
              <img
                src={flagUrls[country]}
                alt={`${country} flag`}
                style={{ width: '20px', marginRight: '8px', marginLeft: '7px' }} // Abstand von links hinzugefügt
              />
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="primary" onClick={handleFilter}>
          <FilterListIcon sx={{ color: 'white', fontSize: '2rem' }} />
        </IconButton>
        <IconButton color="secondary" onClick={handleReset}>
          <CloseIcon sx={{ color: 'white', fontSize: '2rem' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CombinedFilter;
