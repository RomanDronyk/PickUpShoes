import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import style from './style';
import { IInputField, IInputState, INovaDepartment } from '~/screens/CheckoutScreen';
import NoSsr from '@mui/material/NoSsr';


interface INovaPoshtaDepartent {
  inputState: IInputState,
  onInputChange: (value: string | boolean, fieldName: keyof IInputField, id: string) => void
  setInputState: React.Dispatch<React.SetStateAction<IInputState>>,
}
const NovaPoshtaDepartent: React.FC<INovaPoshtaDepartent> = ({ inputState, onInputChange, setInputState }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      const formData = new FormData();
      formData.append("action", "get department");
      formData.append("city", inputState.novaCity.MainDescription);
      formData.append("department", inputState.novaDepartment.value);
      if (inputState.novaDepartment.value.length > 0) {

        try {
          setLoading(true)
          const response = await fetch("/checkout-api", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data: any = await response.json();
            setInputState(prev => ({ ...prev, departmentOption: data?.department || [], }));
          } else {
            console.error("Failed to fetch city data");
          }
          setLoading(false)

        } catch (error) {
          setLoading(false)
          console.error("Error occurred while fetching:", error);
        }
      } else {
        setLoading(false)
      }
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inputState.novaDepartment.value]);

  const handleChange = (event: React.ChangeEvent<{}>, novaDepartment: INovaDepartment | null) => {
    onInputChange(false, "isBlur", "novaDepartment")// Скидаємо стан blur після вибору міста
    if (novaDepartment) {
      setInputState(prev => ({
        ...prev,
        novaDepartment: { ...novaDepartment, value: "", isBlur: true, errorMessage: "" },
      }));
    }
  };

  const [value, setValue] = useState<any>(null)
  useEffect(() => {
    setValue(null)
  }, [inputState.novaCity.value])
  return (
    <>
      <NoSsr>
        <Autocomplete
          id="novaDepartment"
          sx={style}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            onInputChange(true, "isBlur", "novaDepartment")
            setOpen(false);
          }}
          value={value}

          isOptionEqualToValue={(option: INovaDepartment, value) => option.Description === value.Description}
          getOptionLabel={(option: INovaDepartment) => option.Description}
          options={inputState.departmentOption}
          onChange={(event, novaDepartment) => {
            handleChange(event, novaDepartment)
            setValue(novaDepartment)
          }}
          loading={loading}
          noOptionsText="Відділення, не знайдено"
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                placeholder='Відділення'
                value={inputState.novaDepartment.value}
                required
                disabled={inputState.novaCity.MainDescription ? false : true}
                onChange={(element) => {
                  onInputChange(element.target.value, "value", "novaDepartment")
                }}
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
      </NoSsr>

      {(!inputState.novaDepartment.Description && inputState.novaDepartment.isBlur) && <div className='text-red'>{inputState.novaDepartment.errorMessage}</div>}
    </>
  )
}

export default NovaPoshtaDepartent

