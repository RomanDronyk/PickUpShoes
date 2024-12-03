import { Form, useNavigation } from "@remix-run/react"
import CheckoutCartList from "~/components/common/checkoutCartList"
import CheckoutRecommendationList from "~/components/common/checkoutRecommendationList"
import { Input } from "~/components/ui/input"
import PhoneInput from 'react-phone-number-input/input'
import ContactType from "~/components/Checkout/contactType"
import NovaPoshtaCity from "~/components/Checkout/novaPoshtaCity"
import NovaPoshtaDepartent from "~/components/Checkout/novaPoshtaDepartment"
import { Button } from "~/components/ui/button"
import { FC, useEffect, useState } from "react"
import ua from 'react-phone-number-input/locale/ua'
import { emailValidation } from "~/utils"
import { ICheckoutInputErrors, checkoutInputErrors } from "~/mockMessages"
import LoaderNew from "~/components/LoaderNew"

const CheckoutScreen: FC<ICheckoutScreen> = ({ actionErrorMessage, cartsFromCart, recommendedCarts, amount }) => {
  const [inputState, setInputState] = useState<IInputState>({
    firstName: {
      value: "",
      isBlur: false,
      errorMessage: checkoutInputErrors.firstName,
    },
    lastName: {
      value: "",
      isBlur: false,
      errorMessage: checkoutInputErrors.lastName,
    },
    userPhone: {
      value: "",
      isBlur: false,
      errorMessage: checkoutInputErrors.userPhone,
    },
    contactType: {
      value: "",
      isBlur: false,
      errorMessage: checkoutInputErrors.contactType,
    },
    novaCity: {
      AddressDeliveryAllowed: true,
      Area: "",
      DeliveryCity: "",
      MainDescription: "",
      ParentRegionCode: "",
      ParentRegionTypes: "",
      Present: "",
      Ref: "",
      Region: "",
      RegionTypes: "",
      RegionTypesCode: "",
      SettlementTypeCode: "",
      StreetsAvailability: false,
      Warehouses: null,
      isBlur: false,
      errorMessage: checkoutInputErrors.novaCity,
    },
    cityOptions: [],
    novaDepartment: {
      CityDescription: "",
      SettlementAreaDescription: "",
      PostalCodeUA: "",
      Description: "",
      Ref: "",
      value: "",
      isBlur: false,
      errorMessage: checkoutInputErrors.novaDepartment,
    },
    departmentOption: [],
    userEmail: {
      value: "",
      isBlur: false,
      errorMessage: checkoutInputErrors.userEmail,
    },
    userPromo: {
      value: "",
      isBlur: true,
      errorMessage: "",
    },
  })

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const onInputChange = (value: string | boolean, fieldName: keyof IInputField, id: string) => {
    const elementId = id as keyof IInputState;
    if (elementId in inputState && typeof inputState[elementId] === "object") {
      setInputState(prev => ({
        ...prev,
        [elementId]: {
          ...prev[elementId],
          [fieldName]: value
        }
      }));
    }
  };
  const navigation = useNavigation();

  return (
    <div className="overflow-hidden max-w-full flex flex-col-reverse contaier gap-[20px] md:gap-[40px] md:grid md:grid-cols-2 lg:grid-cols-[1fr_1fr] md:grid-cols-2 md:gap-y-10 md:gap-x-10 lg:px-24 px-[10px] my-10 w-full mt-[1rem]">
      <Form action="/checkout" method="POST" className='grid gap-[35px] max-w-full overflow-hidden'>
        <div style={{ position: "absolute", zIndex: -10, opacity: 0 }}>
          <input style={{ width: "0% !important" }} type="hidden" name="note" value={inputState.contactType.value} />
          <input style={{ width: "0% !important" }} type="hidden" name="inputState" value={JSON.stringify(inputState)} />
          <input style={{ width: "0% !important" }} type="hidden" name="products" value={JSON.stringify(cartsFromCart)} />
          <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_city" value={inputState.novaDepartment?.CityDescription} />
          <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_country" value={"Ukraine"} />
          <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_region" value={inputState.novaDepartment?.SettlementAreaDescription} />
          <input style={{ width: "0% !important" }} type="hidden" name="shipping_address_zip" value={inputState.novaDepartment?.PostalCodeUA} />
          <input style={{ width: "0% !important" }} type="hidden" name="shipping_secondary_line" value="string" />
          <input style={{ width: "0% !important" }} type="hidden" name="shipping_receive_point" value={inputState.novaDepartment?.Description} />
          <input style={{ width: "0% !important" }} type="hidden" name="recipient_full_name" value={`${inputState.firstName.value} ${inputState.lastName.value}`} />
          <input style={{ width: "0% !important" }} type="hidden" name="recipient_phone" value={inputState.userPhone.value} />
          <input style={{ width: "0% !important" }} type="hidden" name="warehouse_ref" value={inputState.novaDepartment?.Ref} />
          <input style={{ width: "0% !important" }} type="hidden" name="amount" value={amount.replace(".0", "")} />
          <input type="hidden" name="action" value="create order" />
        </div>
        <div className="register rounded-[20px] border border-black/10 p-[20px_24px] ">
          <h2 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">
            Дані для доставки
          </h2>
          <fieldset className="flex flex-col gap-[15px]">
            <div className='pb-[15px] border-b border-black/20'>
              <Input
                onBlur={(e) => onInputChange(true, "isBlur", e.target.id)}
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="firstName"
                placeholder="Ім’я отримувача"
                aria-label="First Name"
                value={inputState.firstName.value}
                onChange={(event) => {
                  const value = event.target.value
                  const key = event.target.id as keyof ICheckoutInputErrors;
                  (value.length < 3) ? onInputChange(checkoutInputErrors[key], "errorMessage", key) : onInputChange("", "errorMessage", key);
                  onInputChange(value, "value", key);
                }}
                autoFocus
                required
                className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
              />
              {inputState.firstName.errorMessage && inputState.firstName.isBlur && <div className="text-red">{inputState.firstName.errorMessage}</div>}
            </div>
            <div className='pb-[15px] border-b border-black/20'>
              <Input
                onBlur={(e) => onInputChange(true, "isBlur", e.target.id)}
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="lastName"
                placeholder="Прізвище"
                aria-label="Last Name"
                required
                onChange={(event) => {
                  const value = event.target.value
                  const key = event.target.id as keyof ICheckoutInputErrors;
                  (value.length < 3) ? onInputChange(checkoutInputErrors[key], "errorMessage", key) : onInputChange("", "errorMessage", key);
                  onInputChange(value, "value", key);
                }}
                value={inputState.lastName.value}
                className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
              />
              {inputState.lastName.errorMessage && inputState.lastName.isBlur && <div className="text-red">{inputState.lastName.errorMessage}</div>}
            </div>
            <div className='pb-[15px] border-b border-black/20'>
              <PhoneInput
                id="userPhone"
                name="phone"
                type="phone"
                onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => onInputChange(true, "isBlur", e.target.id)}
                autoComplete="phone"
                international={true}
                placeholder="+ 38 (098) 999 99-99"
                labels={ua}
                smartCaret={true}
                withCountryCallingCode={true}
                useNationalFormatForDefaultCountryValue={true}
                country="UA"
                inputComponent={Input}
                className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
                value={inputState.userPhone.value}
                maxLength="16"
                minLength="16"
                required
                onChange={(event) => {
                  console.log(event?.length)
                  if (event) {
                    const key = "userPhone" as keyof ICheckoutInputErrors;
                    (event.length < 13) ? onInputChange(checkoutInputErrors[key], "errorMessage", key) : onInputChange("", "errorMessage", key);
                    onInputChange(event, "value", key);
                  }
                }} />
              {inputState.userPhone.errorMessage && inputState.userPhone.isBlur && <div className="text-red">{inputState.userPhone.errorMessage}</div>}

            </div>
            <div className='pb-[15px] border-b border-black/20'>
              <ContactType onInputChange={onInputChange} inputState={inputState} />
            </div>
            <div className='pb-[15px] border-b border-black/20'>
              <NovaPoshtaCity inputState={inputState} onInputChange={onInputChange} setInputState={setInputState} />
            </div>
            <div className='pb-[15px] border-b border-black/20'>
              <NovaPoshtaDepartent inputState={inputState} onInputChange={onInputChange} setInputState={setInputState} />
            </div>
            <div className=''>
              <Input
                onBlur={(e) => onInputChange(true, "isBlur", e.target.id)}
                id="userEmail"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="E-mail"
                aria-label="Re-enter E-mail"
                minLength={4}
                value={inputState.userEmail.value}
                onChange={(event) => {
                  const key = event.target.id as keyof ICheckoutInputErrors;
                  (event.target.value.length === 3 || !emailValidation(event.target.value)) ? onInputChange(checkoutInputErrors[key], "errorMessage", event.target.id) : onInputChange("", "errorMessage", event.target.id);
                  onInputChange(event.target.value, "value", event.target.id);
                }}
                required
                className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
              />
              {inputState.userEmail.errorMessage && inputState.userEmail.isBlur && <div className="text-red">{inputState.userEmail.errorMessage}</div>}
            </div>
          </fieldset>

        </div>
        <div className="register rounded-[20px] border border-black/10 p-[20px_24px] ">
          <div>
            <h2 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">
              Спосіб доставки
            </h2>
            <div className="delivery-options">

              <div className="flex mb-4 items-start">
                <input defaultChecked style={{ accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="delivery1" name="delivery" value="novaposhta" className="mr-2" />
                <label style={{ cursor: "pointer" }} htmlFor="delivery1" className="font-normal text-[16px]">Доставка Новою Поштою</label>
              </div>
              <div className="flex mb-4 items-start">
                <input style={{ accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="delivery2" name="delivery" value="ukrposhta" className="mr-2" />
                <label style={{ cursor: "pointer" }} htmlFor="delivery2" className="font-normal text-[16px]">Самовивіз (м. Коломия вул. Чорновола 28 | ТЦ “Водолій”, 3 поверх)</label>
              </div>
            </div>
          </div>
          <div>
            <h2 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">
              Спосіб оплати
            </h2>
            <div className="payment-options">
              <div className="flex mb-4 items-start">
                <input defaultChecked style={{ accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="payment1" name="payment" value="card" className="mr-2" />
                <label htmlFor="payment1" className="font-normal text-[16px]">Оплата карткою онлайн</label>
              </div>
              <div className="flex mb-4 items-start">
                <input style={{ height: "auto", accentColor: "black", cursor: "pointer", marginTop: 5 }} type="radio" id="payment2" name="payment" value="cash" className="mr-2" />
                <label htmlFor="payment2" className="font-normal text-[16px]">При отриманні з предоплатою 200 грн
                  <span className='text-[14px] font-medium' >
                    *Менеджер зв’яжеться з вами протягом 15 хвилин та надасть реквізити для внесення предоплати
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div >
            <div className=' justify-between flex font-bold'>
              <h2 className="xl:text-[32px] text-nowrap sm:text-[24px] text-left  mb-[15px] text-[22px]  sm:mb-[20px]">
                До сплати:
              </h2>
              <span className='xl:text-[32px] text-nowrap sm:text-[24px] text-right  mb-[15px] text-[22px]  sm:mb-[20px]' >
                {`${amount} грн`}
              </span>
            </div>
            <div className='hidden flex justify-between gap-[12px] pb-[24px]'>
              {/* <Input
                id="promo"
                name="promo"
                type="text"
                autoComplete="promo"
                placeholder="Ваш промокод"
                aria-label="Не правильний промокод"
                minLength={4}
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="bg-input px-6 py-3 text-xl placeholder:text-xl h-[52px] "
              />
              <Button className='rounded-[64px]'>
                Додати
              </Button> */}
            </div>
            {actionErrorMessage && (
              <div className="text-red py-[15px] text-lg">
                {actionErrorMessage}
              </div>
            )}
            <Button disabled={navigation.state === "idle" ? false : true} className='rounded-[64px] w-[100%] text-semibold text-[18px] text-white py-[16px]'>
              {navigation.state == "idle" ? <>
                Замовити
                <span style={{ marginLeft: 15 }}>
                  <svg width="16" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.2959 0.454104L19.0459 7.2041C19.1508 7.30862 19.234 7.43281 19.2908 7.56956C19.3476 7.7063 19.3768 7.85291 19.3768 8.00098C19.3768 8.14904 19.3476 8.29565 19.2908 8.4324C19.234 8.56915 19.1508 8.69334 19.0459 8.79785L12.2959 15.5479C12.0846 15.7592 11.7979 15.8779 11.4991 15.8779C11.2002 15.8779 10.9135 15.7592 10.7022 15.5479C10.4908 15.3365 10.3721 15.0499 10.3721 14.751C10.3721 14.4521 10.4908 14.1654 10.7022 13.9541L15.5313 9.12504L1.75 9.12504C1.45163 9.12504 1.16548 9.00651 0.954505 8.79554C0.743527 8.58456 0.625 8.29841 0.625 8.00004C0.625 7.70167 0.743527 7.41552 0.954505 7.20455C1.16548 6.99357 1.45163 6.87504 1.75 6.87504L15.5313 6.87504L10.7013 2.04598C10.4899 1.83463 10.3712 1.54799 10.3712 1.2491C10.3712 0.950218 10.4899 0.663574 10.7013 0.45223C10.9126 0.240885 11.1992 0.122151 11.4981 0.122151C11.797 0.122151 12.0837 0.240885 12.295 0.45223L12.2959 0.454104Z" fill="white" />
                  </svg>
                </span>
              </> : <div className="h-[18px]"><LoaderNew fullHeight={false} /></div>}

            </Button>
          </div>
        </div>
      </Form>
      <div>
        <h1 className="xl:text-[32px] text-[24px] text-left  font-medium mb-[20px]">Ви обрали:</h1>
        <div className="register rounded-[20px] border border-black/10 p-[0px_24px] ">
          <CheckoutCartList carts={cartsFromCart} />
        </div>
        {recommendedCarts.length > 0 && <div>
          <h1 className="xl:text-[32px] mt-[20px] text-[24px] text-left  font-medium mb-[20px]">Також рекомендуєм:</h1>
          <div className="register rounded-[20px] border border-black/10 p-[0px_24px] ">
            <CheckoutRecommendationList carts={recommendedCarts} />
          </div>
        </div>
        }
      </div>
    </div>
  )

}

export default CheckoutScreen




interface ICheckoutScreen {
  cartsFromCart: any,
  recommendedCarts: any,
  amount: string,
  actionErrorMessage?: string
}
export interface IInputField {
  value: string;
  isBlur: boolean;
  errorMessage: string;
}

export interface INovaDepartment {
  CityDescription: string;
  SettlementAreaDescription: string;
  PostalCodeUA: string;
  Description: string;
  Ref: string;
  isBlur: boolean,
  errorMessage: string,
  value: string,
}
export interface INovaCity {
  AddressDeliveryAllowed: true,
  Area: string,
  DeliveryCity: string,
  MainDescription: string,
  ParentRegionCode: string,
  ParentRegionTypes: string,
  Present: string,
  Ref: string,
  Region: string,
  RegionTypes: string,
  RegionTypesCode: string,
  SettlementTypeCode: string,
  StreetsAvailability: boolean,
  Warehouses: number | null,
  isBlur: boolean,
  errorMessage: string,
}

export interface IInputState {
  novaCity: INovaCity;
  cityOptions: string[];
  novaDepartment: INovaDepartment;
  departmentOption: string[];
  firstName: IInputField;
  lastName: IInputField;
  userPhone: IInputField;
  userEmail: IInputField;
  userPromo: IInputField;
  contactType: IInputField
}

