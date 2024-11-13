import { Link } from '@remix-run/react';
import GoogleAuthButton from '~/components/GoogleAuthButton';
import { DialogHeader, DialogTitle } from '~/components/ui/dialog';


const ReviewLogin = () => {
  return (
    <div style={{ display: "block" }}>
      <DialogHeader className="block overflow-hidden flex items-center justify-center ">
        <DialogTitle className='font-bold text-[26px] text-center'>Для початку вам потрібно зареєструватись!</DialogTitle>
      </DialogHeader>
      <div className="size-grid">
        <div className="w-full flex items-center justify-end mt-10">
          <Link to="/account/login"
            className="flex items-center justify-center whitespace-nowrap rounded-[15px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-[50px] bg-black text-white font-medium text-[18px] px-[23px] w-full rounded-[62px] py-[15px] cursor-pointer group "
          >
            В особистий кабінет
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:text-black"
            >
              <path
                d="M24 27V24.3333C24 22.9188 23.5224 21.5623 22.6722 20.5621C21.8221 19.5619 20.669 19 19.4667 19H11.5333C10.331 19 9.17795 19.5619 8.32778 20.5621C7.47762 21.5623 7 22.9188 7 24.3333V27"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 14C17.9853 14 20 11.9853 20 9.5C20 7.01472 17.9853 5 15.5 5C13.0147 5 11 7.01472 11 9.5C11 11.9853 13.0147 14 15.5 14Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
          <GoogleAuthButton />
      </div>
    </div>
  )
}
export default ReviewLogin;