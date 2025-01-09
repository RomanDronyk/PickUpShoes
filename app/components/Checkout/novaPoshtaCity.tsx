import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import style from './style';
import { IInputField, IInputState, INovaCity } from '~/screens/CheckoutScreen';
import NoSsr from '@mui/material/NoSsr';
import { checkoutInputErrors } from '~/mockMessages';

interface INovaPoshtaCity {
  inputState: IInputState;
  onInputChange: (
    value: string | boolean,
    fieldName: keyof IInputField,
    id: string,
  ) => void;
  setInputState: React.Dispatch<React.SetStateAction<IInputState>>;
}

const NovaPoshtaCity: React.FC<INovaPoshtaCity> = ({
  inputState,
  onInputChange,
  setInputState,
}) => {
  const [open, setOpen] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  // const loading = false

  // useEffect(() => {
  //   if (!open) {
  //     setInputState(prev => ({ ...prev, cityOptions: [] }));
  //   }
  // }, [open]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      if (inputState?.novaCity?.value?.length > 0) {
        setInputState((prev) => ({ ...prev, cityOptions: [] }));

        const formData = new FormData();
        formData.append('action', 'get city');
        formData.append('city', inputState.novaCity.value);
        setLoading(true);
        try {
          const response = await fetch('/checkout-api', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data: any = await response.json();
            setInputState((prev) => ({
              ...prev,
              cityOptions: data?.cities || [],
            }));
            console.log('dslkfjsldkfjs;dlkfjsd;lfkj');
          } else {
            console.error('Failed to fetch city data');
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);

          console.error('Error occurred while fetching:', error);
        }
      }
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inputState.novaCity.value]);

  const handleCityChange = (
    event: React.ChangeEvent<{}>,
    novaCity: INovaCity | null,
  ) => {
    onInputChange(false, 'isBlur', 'novaCity'); // Скидаємо стан blur після вибору міста
    if (novaCity) {
      setInputState((prev) => ({
        ...prev,
        novaCity: { ...novaCity, isBlur: true, errorMessage: '' },
      }));
      setInputState((prev) => ({
        ...prev,
        novaDepartment: {
          CityDescription: '',
          SettlementAreaDescription: '',
          PostalCodeUA: '',
          Description: '',
          Ref: '',
          value: '',
          isBlur: true,
          errorMessage: prev.novaDepartment.errorMessage,
        },
      }));
    }
  };

  return (
    <>
      <NoSsr>
        <Autocomplete
          id="novaCity"
          sx={style}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
            onInputChange(true, 'isBlur', 'novaCity');
          }}
          onInputChange={(e) => {
            setInputState((prev) => ({
              ...prev,
              novaDepartment: {
                CityDescription: '',
                SettlementAreaDescription: '',
                PostalCodeUA: '',
                Description: '',
                Ref: '',
                value: '',
                isBlur: false,
                errorMessage: checkoutInputErrors.novaDepartment,
              },
              novaCity: {
                AddressDeliveryAllowed: true,
                Area: '',
                DeliveryCity: '',
                MainDescription: '',
                ParentRegionCode: '',
                ParentRegionTypes: '',
                Present: '',
                Ref: '',
                Region: '',
                RegionTypes: '',
                RegionTypesCode: '',
                SettlementTypeCode: '',
                StreetsAvailability: false,
                Warehouses: null,
                isBlur: false,
                value: '',
                errorMessage: checkoutInputErrors.novaCity,
              },
              departmentOption: [],
            }));
          }}
          onChange={handleCityChange}
          isOptionEqualToValue={(option, value) =>
            option.Present === value.Present
          }
          getOptionLabel={(option) => option.Present}
          options={inputState?.cityOptions}
          loading={loading}
          noOptionsText="Місто не знайдено"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Місто"
              required
              onChange={(e) =>
                onInputChange(e.target.value, 'value', 'novaCity')
              }
              value={inputState.novaCity.value}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </NoSsr>

      {!inputState.novaCity.MainDescription && inputState.novaCity.isBlur && (
        <div className="text-red">{inputState.novaCity.errorMessage}</div>
      )}
    </>
  );
};
export default NovaPoshtaCity;
