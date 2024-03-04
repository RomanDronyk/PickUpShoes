import {Link} from '@remix-run/react';
import notFoundImage from '../assets/images/404.jpg';

export default function NotFound() {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1">
      <div className="relative overflow-hidden h-screen md:h-auto w-screen md:w-full">
        <div className="-scale-x-[1] flex items-center justify-center w-full bg-notFoundBg bg-center bg-contain bg-white/7 blur-[56px] bg-blend-screen h-full"></div>
        <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center flex-col">
          <h1 className="md:text-[128px] sm:text-[68px] text-[48px] text-white">
            404
          </h1>
          <span className="text-white sm:text-3xl text-xl">
            Сторінку не знайдено
          </span>
          <br />
          <br />
          <Link
            to="/"
            className="text-white bg-red flex items-center justify-center py-3 px-16 text-2xl rounded-[20px]"
          >
            На головну
          </Link>
        </div>
      </div>
      <div className="md:block hidden">
        <img src={notFoundImage} alt="background" />
      </div>
    </div>
  );
}
