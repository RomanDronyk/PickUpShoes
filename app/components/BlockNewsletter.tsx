import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Form, useActionData, useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { Button } from './ui/button';

export default function BlockNewsletter({ storefront }: any) {
  const [email, setEmail] = useState('');
  const fetcher: any = useFetcher();
  const { state, data } = fetcher;
  const subscribeSuccess = data?.subscriber;
  const subscribeError = data?.error;

  useEffect(() => {
    console.log(subscribeError, 'error')
    console.log(subscribeSuccess, 'success')
    if (state === "submitting") {
      setEmail("")
    }
  }, [state])

  return (
    <div className="max-w-[1260px] px-[20px] w-full pb-[57px]">
      <div className="BlockNewsletter bg-PhotoSinsay bg-cover bg-center bg-no-repeat rounded-[20px] px-[60px] pt-[40px] pb-[28px] w-full flex">
        <div className="BlockNewsletter__row">
          <div className="BlockNewsletter__image bg-smallLogoIcon"></div>
          <h3 className="BlockNewsletter__text">
            будь в курсі. отримуй <br /> знижки — першим
          </h3>
        </div>
        {subscribeError?.message && (
            <div className='rounded-[30px] items-center text-[18px] md:text-[22px] max-w-[327px] z-10 bg-white md:p-[19px] h-auto  flex gap-[10px] leading-[140%] p-[10px_20px] md:gap-[16px]'>
              <div className='rounded-[50%] '>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_969_5864)">
                    <path d="M13.6804 26.3196C13.5281 26.1672 13.4425 25.9606 13.4425 25.7452C13.4425 25.5297 13.5281 25.3231 13.6804 25.1707L18.8511 20L13.6804 14.8292C13.5324 14.676 13.4505 14.4707 13.4523 14.2577C13.4542 14.0447 13.5396 13.8409 13.6903 13.6902C13.8409 13.5396 14.0447 13.4542 14.2578 13.4523C14.4708 13.4505 14.676 13.5323 14.8293 13.6803L20 18.8511L25.1708 13.6803C25.324 13.5323 25.5292 13.4505 25.7423 13.4523C25.9553 13.4542 26.1591 13.5396 26.3097 13.6902C26.4604 13.8409 26.5458 14.0447 26.5477 14.2577C26.5495 14.4707 26.4676 14.676 26.3196 14.8292L21.1489 20L26.3196 25.1707C26.4676 25.324 26.5495 25.5292 26.5477 25.7422C26.5458 25.9553 26.4604 26.1591 26.3097 26.3097C26.1591 26.4603 25.9553 26.5458 25.7423 26.5476C25.5292 26.5495 25.324 26.4676 25.1708 26.3196L20 21.1488L14.8293 26.3196C14.6769 26.4719 14.4703 26.5575 14.2548 26.5575C14.0394 26.5575 13.8328 26.4719 13.6804 26.3196Z" fill="#F50606" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 36.25C28.9749 36.25 36.25 28.9749 36.25 20C36.25 11.0251 28.9749 3.75 20 3.75C11.0251 3.75 3.75 11.0251 3.75 20C3.75 28.9749 11.0251 36.25 20 36.25ZM20 34.625C28.0771 34.625 34.625 28.0771 34.625 20C34.625 11.9229 28.0771 5.375 20 5.375C11.9229 5.375 5.375 11.9229 5.375 20C5.375 28.0771 11.9229 34.625 20 34.625Z" fill="#F50606" />
                  </g>
                  <defs>
                    <clipPath id="clip0_969_5864">
                      <rect width="39" height="39" fill="white" transform="translate(0.5 0.5)" />
                    </clipPath>
                  </defs>
                </svg>


              </div>
              <p className='text-black font-medium '>
                Виникла <span className='text-[#F50606] font-semibold'>помилка,</span> <span className='cursor-pointer' >спробуй ще раз...</span>
              </p>
            </div>
          )
        }
        {subscribeSuccess && (
          <div className='success-message  rounded-[30px] items-center text-[18px] md:text-[22px] max-w-[327px] z-10 bg-white md:p-[19px] h-auto  flex gap-[10px] leading-[140%] p-[10px_20px] md:gap-[16px]'>
            <div className='rounded-[50%] '>
              <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17 34.1666C26.205 34.1666 33.6667 26.705 33.6667 17.5C33.6667 8.29498 26.205 0.833313 17 0.833313C7.79504 0.833313 0.333374 8.29498 0.333374 17.5C0.333374 26.705 7.79504 34.1666 17 34.1666ZM25.9517 12.225C26.0297 12.1447 26.0907 12.0494 26.131 11.945C26.1714 11.8406 26.1903 11.7292 26.1866 11.6173C26.183 11.5054 26.1568 11.3954 26.1097 11.2938C26.0626 11.1923 25.9955 11.1013 25.9125 11.0262C25.8294 10.9512 25.7321 10.8936 25.6263 10.857C25.5205 10.8204 25.4084 10.8055 25.2967 10.8132C25.1851 10.8208 25.0761 10.8509 24.9763 10.9016C24.8765 10.9523 24.7879 11.0226 24.7159 11.1083L14.7334 22.1391L9.24171 16.8966C9.08191 16.7439 8.868 16.6609 8.64702 16.6659C8.42604 16.6709 8.21609 16.7635 8.06337 16.9233C7.91065 17.0831 7.82767 17.297 7.83267 17.518C7.83767 17.739 7.93025 17.9489 8.09004 18.1016L14.2017 23.935L14.8209 24.5266L15.395 23.8916L25.9517 12.225Z" fill="#03963E" />
              </svg>

            </div>
            <p className='text-black font-medium '>
              Підписка на розсилку
              <span className='text-[#03963E] font-semibold'> - успішна</span>
            </p>
          </div>
        )}



        {!subscribeError && !subscribeSuccess && (
                  <fetcher.Form method="post" action="/newsletter" className="BlockNewsletter__collum">
                  <div className="flex items-center justify-center rounded-[27px] border border-placeholderText w-full px-[20px] py-[3px] BlockNewsletter_input_block">
                    <svg
                      width="22"
                      height="16"
                      viewBox="0 0 22 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 0.125H2C1.70163 0.125 1.41548 0.243526 1.2045 0.454505C0.993526 0.665483 0.875 0.951631 0.875 1.25V14C0.875 14.4973 1.07254 14.9742 1.42417 15.3258C1.77581 15.6775 2.25272 15.875 2.75 15.875H19.25C19.7473 15.875 20.2242 15.6775 20.5758 15.3258C20.9275 14.9742 21.125 14.4973 21.125 14V1.25C21.125 0.951631 21.0065 0.665483 20.7955 0.454505C20.5845 0.243526 20.2984 0.125 20 0.125ZM11 7.97375L4.89219 2.375H17.1078L11 7.97375ZM7.69906 8L3.125 12.1925V3.8075L7.69906 8ZM9.36406 9.52625L10.2397 10.3297C10.4472 10.52 10.7185 10.6255 11 10.6255C11.2815 10.6255 11.5528 10.52 11.7603 10.3297L12.6359 9.52625L17.1078 13.625H4.89219L9.36406 9.52625ZM14.3009 8L18.875 3.8075V12.1925L14.3009 8Z"
                        fill="black"
                        fillOpacity="0.4"
                      />
                    </svg>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      name='email'
                      placeholder="Введіть свій e-mail"
                      className="border-none BlockNewsletter_input"
                    />
                  </div>
                  <Button
                    disabled={email.length <= 6}
                    type="submit"
                    className="bg-red text-white font-medium text-[18px] w-full rounded-[62px] py-[10px] cursor-pointer"
                  >
                    {subscribeSuccess ? "Ви успішно підписались" : subscribeError ? "Ви уже підписані" : " Підписатись на розсилку"}
                  </Button>
                  {subscribeSuccess && (
                    <p className='text-green text-center' style={{ color: 'green' }}>
                      Ви успішно підписались на розсилку
                    </p>
                  )}
                  {subscribeError && <p className='text-red text-center'> {subscribeError.message}</p>}
                </fetcher.Form>
        )}
      </div>
    </div>
  );
}