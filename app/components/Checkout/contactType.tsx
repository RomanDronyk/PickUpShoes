import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import style from './style';
import { IInputField, IInputState } from '~/screens/CheckoutScreen';
import NoSsr from '@mui/material/NoSsr';

interface IContactType {
  inputState: IInputState,
  onInputChange: (value: string | boolean, fieldName: keyof IInputField, id: string) => void
}

const ContactType: React.FC<IContactType> = ({ onInputChange, inputState }) => {
  const [open, setOpen] = useState(false);

  return  (

    <>
    <NoSsr>
    <Autocomplete
        id="contactType"
        sx={style}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
          onInputChange(true, "isBlur", "contactType")
        }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={contactType}
        defaultValue={contactType[1]}
        onChange={(event, selectedOption) => {
          onInputChange(selectedOption?.name || "", "value", "contactType")
          onInputChange("", "errorMessage", "contactType")
          onInputChange(false, "isBlur", "contactType")

        }}
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
    </NoSsr>

      {(!inputState.contactType.value && inputState.contactType.isBlur) && <div className='text-red'>{inputState.contactType.errorMessage}</div>}

    </>

  )
}
export default ContactType


const contactType = [
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