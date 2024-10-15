import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

import style from './style';

interface Film {
  MainDescription: string;
  Ref: string;
  Present: string;
  Description: string;
}


export default function NovaPoshtaDepartent({ options, setOptions, setDepartment, city }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputDepartment, setInputDepartment] = useState("")

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }


  useEffect(() => {
    if (options.length > 0) {
      setLoading(false)
    }
  }, [options])

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (!open) {
      (async () => {
        setLoading(false)
      })();
    }
  }, [open]);


  useEffect(() => {
    setDepartment(() => options.filter(element => element.Description === inputDepartment))

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      const formData = new FormData();
      formData.append("action", "get department");
      formData.append("city", city);
      formData.append("department", inputDepartment);
      if (inputDepartment.length > 0) {
        try {
          const response = await fetch("/checkout-api", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data: any = await response.json();
            setOptions(data?.department || []);
          } else {
            console.error("Failed to fetch city data");
          }
        } catch (error) {
          console.error("Error occurred while fetching:", error);
        }
      } else {
        setLoading(false)
      }
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inputDepartment]);


  return isReady ? (
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
      isOptionEqualToValue={(option, value) => option.Description === value.Description}
      getOptionLabel={(option) => option.Description}
      options={options}
      onChange={(event, department) => setDepartment(department)}
      loading={loading}
      noOptionsText="Відділення, не знайдено"
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            placeholder='Відділення'
            value={inputDepartment}
            required
            disabled={city ? false : true}
            onChange={(element) => setInputDepartment(element.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment >
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )
      }}
    />):null
  
}
