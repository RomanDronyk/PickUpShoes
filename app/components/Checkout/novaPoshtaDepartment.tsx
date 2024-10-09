import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { cn } from '~/lib/utils';
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
  const fetcher: any = useFetcher();

  useEffect(() => {
    if (fetcher?.data?.department?.length > 0) {
      setOptions(fetcher?.data?.department || [])
    }
  }, [fetcher])
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

    const timer = setTimeout(() => {
      if (inputDepartment.length > 0) {
        setLoading(true)
        fetcher.submit(
          { action: "get department", city: city, department: inputDepartment },
          { method: "post", action: "/checkout-api" }
        );

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
      />
    </>
  );
}
