import {Input} from './ui/input';

export function SubscribeFooter() {
  return (
    <div className="footer-subscribe flex flex-col gap-4">
      <span className="text-white text-base font-medium">
        Залиш свій email та отримуй знижки першим
      </span>
      <div className="flex items-center justify-center rounded-[27px] border-placeholderText border max-w-[240px] px-[20px] py-[3px]">
        <Input
          type="email"
          placeholder="Введіть свій e-mail"
          className="placeholder:text-placeholderText border-none"
        />
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
      </div>
    </div>
  );
}
