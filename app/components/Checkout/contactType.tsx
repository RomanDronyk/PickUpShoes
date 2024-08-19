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

export default function ContactType({setCity}:any) {
  const [open, setOpen] = useState(false);
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
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={contactType}
      noOptionsText="Місто не знайдено"
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder='Спосіб звязку'
          name="contactType"
          required
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
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

const contactType  = [
  {
    key: "viber",
    name: "viber"
  },
  {
    key: "telegram",
    name: "telegram"
  },
  {
    key: "whatsapp",
    name: "whatsapp"
  }
]