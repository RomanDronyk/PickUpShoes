import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {HomeHeroQuery} from 'storefrontapi.generated';
import {Button} from './ui/button';

export function Hero({heroData}: {heroData: HomeHeroQuery}) {
  const {
    collection: {banner, motto, heading},
  } = heroData;
  const mottoArr = JSON.parse(motto.value);
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 w-full">
      <div className="flex flex-col justify-center items-center md:items-start  bg-heroBg w-full h-full md:bg-contain bg-cover bg-center bg-no-repeat">
        <div className="w-full sm:pl-5 lg:pl-24 sm:w-auto flex flex-col items-center justify-center md:items-start pt-10 md:pt-0 max-[390px]:px-5">
          <h1 className="font-semibold text-[27px] md:text-2xl xl:text-[27px] opacity-45">
            {heading.value}
          </h1>
          <div className="mt-7">
            <span className="inline-flex bg-white rounded-[30px] px-5 font-semibold text-black  text-[26px]  md:text-3xl lg:text-4xl  xl:text-[42px] mr-3">
              Виділяйся
            </span>
            <span className="text-[#D70000] font-semibold text-[26px]  md:text-3xl lg:text-4xl xl:text-[42px]">
              з комфортом
            </span>
          </div>
          <div className="mt-[22px]">
            <ul className="flex flex-col gap-[15px]">
              {mottoArr.map((motto: string, index: number) => (
                <li
                  key={`motto-${index}`}
                  className="flex items-center gap-[17px] "
                >
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 20.431C4.477 20.431 0 15.9614 0 10.4476C0 4.93378 4.477 0.464233 10 0.464233C15.523 0.464233 20 4.93378 20 10.4476C20 15.9614 15.523 20.431 10 20.431ZM9.003 14.4409L16.073 7.3817L14.66 5.97006L9.003 11.6176L6.174 8.79335L4.76 10.205L9.003 14.4409Z"
                      fill="#B80000"
                    />
                  </svg>
                  <span className="font-semibold text-lg   md:text-lg xl:text-xl">
                    {motto}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <Button
              asChild
              className="flex items-center gap-[15px] bg-gradient-to-r from-[#F50606] to-[#B80000] text-white rounded-[60px] py-[9px] h-[55px] xl:h-[60px] px-[85px] max-w-[370px]"
            >
              <Link prefetch="intent" to="collections/catalog">
                <span className="font-medium text-xl  md:text-2xl xl:text-[28px]">
                  До каталогу
                </span>
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 0C18.2652 0 18.5196 0.105357 18.7071 0.292893C18.8946 0.48043 19 0.734784 19 1V4H22C22.2652 4 22.5196 4.10536 22.7071 4.29289C22.8946 4.48043 23 4.73478 23 5C23 5.26522 22.8946 5.51957 22.7071 5.70711C22.5196 5.89464 22.2652 6 22 6H19V9C19 9.26522 18.8946 9.51957 18.7071 9.70711C18.5196 9.89464 18.2652 10 18 10C17.7348 10 17.4804 9.89464 17.2929 9.70711C17.1054 9.51957 17 9.26522 17 9V6H14C13.7348 6 13.4804 5.89464 13.2929 5.70711C13.1054 5.51957 13 5.26522 13 5C13 4.73478 13.1054 4.48043 13.2929 4.29289C13.4804 4.10536 13.7348 4 14 4H17V1C17 0.734784 17.1054 0.48043 17.2929 0.292893C17.4804 0.105357 17.7348 0 18 0ZM3 1C2.20435 1 1.44129 1.31607 0.87868 1.87868C0.316071 2.44129 0 3.20435 0 4V20C0 20.7956 0.316071 21.5587 0.87868 22.1213C1.44129 22.6839 2.20435 23 3 23H19C19.7956 23 20.5587 22.6839 21.1213 22.1213C21.6839 21.5587 22 20.7956 22 20V14C22 13.2044 21.6839 12.4413 21.1213 11.8787C20.5587 11.3161 19.7956 11 19 11H12V4C12 3.20435 11.6839 2.44129 11.1213 1.87868C10.5587 1.31607 9.79565 1 9 1H3ZM10 11H2V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H9C9.26522 3 9.51957 3.10536 9.70711 3.29289C9.89464 3.48043 10 3.73478 10 4V11ZM12 21V13H19C19.2652 13 19.5196 13.1054 19.7071 13.2929C19.8946 13.4804 20 13.7348 20 14V20C20 20.2652 19.8946 20.5196 19.7071 20.7071C19.5196 20.8946 19.2652 21 19 21H12ZM10 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V13H10V21Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Image
          alt="hero"
          key={banner.reference.id}
          data={banner.reference.image}
        />
      </div>
    </div>
  );
}
