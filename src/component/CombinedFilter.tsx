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
  },
  '& .MuiInputLabel-root': {
    color: 'black',
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#ced4da',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
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
      <FormControl variant="outlined" sx={{ minWidth: { xs: '100%', md: 200 }, backgroundColor: 'white' }}>
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
      <FormControl variant="outlined" sx={{ minWidth: { xs: '100%', md: 200 }, backgroundColor: 'white' }}>
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
      <FormControl variant="outlined" sx={{ minWidth: { xs: '100%', md: 200 }, backgroundColor: 'white' }}>
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
        <IconButton color="primary" onClick={handleFilter} sx={{ color: 'white' }}>
          <FilterListIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleReset} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CombinedFilter;
