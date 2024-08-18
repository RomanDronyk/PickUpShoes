import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';



export function SubscribeFooter() {
  const [email, setEmail] = useState('');
  const fetcher = useFetcher();
  const { state, data }:any = fetcher;
  const subscribeSuccess = data?.subscriber;
  const subscribeError = data?.error;

  useEffect(() => {
    if (state === "submitting") {
      setEmail("")
    }
  }, [state])
  return (
    <div className="footer-subscribe flex flex-col gap-4">
      <span className="text-white sm:text-sm lg:text-base text-base font-medium">
        Залиш свій email та отримуй знижки першим
      </span>
      {subscribeSuccess && (
        <div className='success-message  rounded-[30px] items-center text-[14px] md:text-[16px] max-w-[321px] z-10 bg-white md:p-[12px_20px] h-auto  flex gap-[8px] leading-[140%] p-[10px_20px] md:gap-[12px]'>
          <p className='text-black font-medium '>
            Підписка на розсилку
            <span className='text-[#03963E] font-semibold'> - успішна</span>
          </p>
          <div className='rounded-[50%] '>
            <svg width="20" height="20" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17 34.1666C26.205 34.1666 33.6667 26.705 33.6667 17.5C33.6667 8.29498 26.205 0.833313 17 0.833313C7.79504 0.833313 0.333374 8.29498 0.333374 17.5C0.333374 26.705 7.79504 34.1666 17 34.1666ZM25.9517 12.225C26.0297 12.1447 26.0907 12.0494 26.131 11.945C26.1714 11.8406 26.1903 11.7292 26.1866 11.6173C26.183 11.5054 26.1568 11.3954 26.1097 11.2938C26.0626 11.1923 25.9955 11.1013 25.9125 11.0262C25.8294 10.9512 25.7321 10.8936 25.6263 10.857C25.5205 10.8204 25.4084 10.8055 25.2967 10.8132C25.1851 10.8208 25.0761 10.8509 24.9763 10.9016C24.8765 10.9523 24.7879 11.0226 24.7159 11.1083L14.7334 22.1391L9.24171 16.8966C9.08191 16.7439 8.868 16.6609 8.64702 16.6659C8.42604 16.6709 8.21609 16.7635 8.06337 16.9233C7.91065 17.0831 7.82767 17.297 7.83267 17.518C7.83767 17.739 7.93025 17.9489 8.09004 18.1016L14.2017 23.935L14.8209 24.5266L15.395 23.8916L25.9517 12.225Z" fill="#03963E" />
            </svg>

          </div>
        </div>
      )}

      {subscribeError?.message && (

        <div className='success-message  rounded-[30px] items-center text-[14px] md:text-[14px] max-w-[321px] z-10 bg-white md:p-[12px_20px] h-auto  flex gap-[8px] leading-[140%] p-[10px_20px] md:gap-[12px]'>

<p className='text-black font-medium '>
                Виникла <span className='text-[#F50606] font-semibold'>помилка,</span> <span className='cursor-pointer' >спробуй ще раз...</span>
              </p>

          <div className='rounded-[50%] '>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>
      )}
      {!subscribeError && !subscribeSuccess &&
        (<fetcher.Form method="post" action="/newsletter" className="flex items-center justify-center rounded-[27px] border-placeholderText border sm:max-w-[240px]  max-sm:max-w-full w-full px-[20px] py-[3px]">

          <Input
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Введіть свій e-mail"
            className="placeholder:text-placeholderText border-none"
          />
          <button>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.91202 12H4.00002L2.02302 4.135C2.01036 4.08929 2.00265 4.04236 2.00002 3.995C1.97802 3.274 2.77202 2.774 3.46002 3.104L22 12L3.46002 20.896C2.78002 21.223 1.99602 20.737 2.00002 20.029C2.00204 19.9657 2.01316 19.9031 2.03302 19.843L3.50002 15"
                stroke="#FAFAFA"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </fetcher.Form>)
      }
    </div>
  );
}
