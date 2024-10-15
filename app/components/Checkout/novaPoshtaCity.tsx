import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import style from './style';

interface Film {
  MainDescription: string;
  Ref: string;
  Present: string;
}
export default function NovaPoshtaCity({ setCity, setDepartment }: any) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly any[]>([]); // Assuming 'Film' is the type of city options
  const [inputCity, setInputCity] = useState("");
  const loading = open && options.length === 0 && inputCity.length > 2;

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }



  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(async () => {
      if (inputCity.length > 0) {
        setOptions([]); // Reset the options before fetching

        // Create FormData object
        const formData = new FormData();
        formData.append("action", "get city");
        formData.append("city", inputCity);

        try {
          const response = await fetch("/checkout-api", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data: any = await response.json();
            setOptions(data?.cities || []);
          } else {
            console.error("Failed to fetch city data");
          }
        } catch (error) {
          console.error("Error occurred while fetching:", error);
        }
      }
    }, 1000);

    setDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inputCity]);
  return isReady ? (<Autocomplete
    id="asynchronous-demo"
    sx={style}
    open={open}
    onOpen={() => {
      setOpen(true);
    }}
    onClose={() => {
      setOpen(false);
    }}
    onChange={(event, city) => {
      setCity(city)
      setInputCity(city)
    }}
    isOptionEqualToValue={(option, value) => option.Present === value.Present}
    getOptionLabel={(option) => option.Present}
    options={options}
    loading={loading}
    noOptionsText="Місто не знайдено"
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder='Місто'
        required
        value={inputCity}
        onChange={(element) => setInputCity(element.target.value)}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    )}
  />) : null
}
