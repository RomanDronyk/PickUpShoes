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

export default function NovaPoshtaCity({ setCity,setDepartment }: any) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Film[]>([]);
  const [inputCity, setInputCity] = useState("")
  const loading = open && options.length === 0 && inputCity.length > 2;
  const fetcher: any = useFetcher();

  useEffect(() => {
    setOptions(fetcher?.data?.cities || [])
    setDepartment(fetcher?.data?.department|| [])
  }, [fetcher])

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    // (async () => {
    //   if (active) {
    //     fetcher.submit(
    //       { action: "get city", city: inputCity },
    //       { method: "post", action: "/checkout-api" }
    //     );
    //   }
    // })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      (async () => {
        setOptions([]);
      })();
    }
  }, [open]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      if (inputCity.length > 0) {
        setOptions([])
        fetcher.submit(
          { action: "get city", city: inputCity },
          { method: "post", action: "/checkout-api" }
        );
      }
    }, 1000);
    setDebounceTimer(timer);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inputCity]);
  return (
    <>
      <Autocomplete
        id="asynchronous-demo"
        sx={style}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(event, city) => setCity(city)}
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
      />

    </>
  );
}
