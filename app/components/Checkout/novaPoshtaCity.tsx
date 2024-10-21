import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import style from './style';
import { IInputField, IInputState, INovaCity } from '~/screens/CheckoutScreen';


interface INovaPoshtaCity {
  inputState: IInputState,
  onInputChange: (value: string | boolean, fieldName: keyof IInputField, id: string) => void
  setInputState: React.Dispatch<React.SetStateAction<IInputState>>,
}

const NovaPoshtaCity: React.FC<INovaPoshtaCity> = ({ inputState, onInputChange, setInputState }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<INovaCity[]>([]);
  const [inputText, setInputCity] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(false)

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
      if (inputText.length > 0) {
        setOptions([]);

        const formData = new FormData();
        formData.append("action", "get city");
        formData.append("city", inputText);
        setLoading(true)
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
          setLoading(false)

        } catch (error) {
          setLoading(false)

          console.error("Error occurred while fetching:", error);
        }
      }
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inputText]);

  const handleCityChange = (event: React.ChangeEvent<{}>, novaCity: INovaCity | null) => {
    onInputChange(false, "isBlur", "novaCity")// Скидаємо стан blur після вибору міста
    if (novaCity) {
      setInputState(prev => ({
        ...prev,
        novaCity: { ...novaCity, isBlur: true, errorMessage: "" },
      }));
      setInputState(prev => ({
        ...prev,
        department: {
          CityDescription: "",
          SettlementAreaDescription: "",
          PostalCodeUA: "",
          Description: "",
          Ref: "",
          value: "",
          isBlur: false,
          errorMessage: prev.novaDepartment.errorMessage,
        }
      }))
    }
  };

  return isReady ? (
    <>
      <Autocomplete
        id="novaCity"
        sx={style}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
          onInputChange(true, "isBlur", "novaCity")
        }}
        onChange={handleCityChange}
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
            value={inputText}
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
      {(!inputState.novaCity.MainDescription && inputState.novaCity.isBlur) && <div className='text-red'>{inputState.novaCity.errorMessage}</div>}
    </>
  ) : null

}
export default NovaPoshtaCity