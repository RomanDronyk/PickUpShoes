import { useState, useRef, useLayoutEffect } from "react";

const DEFAULT_PATH = "/js/hiko-auth-headless.js";

export function SocialLoginWidget({
  shop,
  publicAccessToken,
  logout,
  refresh,
  baseUrl,
}: {
  shop: string;
  publicAccessToken: string;
  logout: Function;
  refresh: Function;
  baseUrl: string;
}) {
  const container = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(DEFAULT_PATH);


  useLayoutEffect(() => {
    // Видаляємо існуючий скрипт (якщо є)
    const existingScript = document.querySelector(`script[src*="${DEFAULT_PATH}"]`);
    const foundNew = document.querySelector(`script[src*="${baseUrl}"]`);
    const foundNew2 = document.querySelector(`script[src*="${"https://api.ipify.org"}"]`);
    const Window: any = window
    if (existingScript || foundNew || foundNew2) {
      existingScript?.remove();
      foundNew2?.remove()
      foundNew?.remove()

      Window.HIKO && Window.HIKO.release && Window.HIKO.release();  // Перевіряємо чи є функція release перед викликом
    }

    // Додаємо новий скрипт
    const script = document.createElement("script");
    script.src = `${baseUrl}${path}`;
    script.async = true;
    script.onload = () =>
      Window.HIKO && Window.HIKO.render(container.current, shop, publicAccessToken);
    document.head.appendChild(script);

    // Логін та оновлення
    logout(() => {
      Window.HIKO && Window.HIKO.logout && Window.HIKO.logout();
      Window.HIKO && Window.HIKO.render(container.current, shop, publicAccessToken);

    });

    refresh(() => {
      const found = document.querySelector(`script[src*="${DEFAULT_PATH}"]`);
      if (found) {
        found.remove();
        Window.HIKO && Window.HIKO.release && Window.HIKO.release();
        setPath(`${DEFAULT_PATH}?t=${Date.now()}`);  // Додаємо час до шляху для уникнення кешування

      }
    });

    return () => {
      const found = document.querySelector(`script[src*="${DEFAULT_PATH}"]`);
      const foundNew = document.querySelector(`script[src*="${baseUrl}"]`);
      const foundNew2 = document.querySelector(`script[src*="${"https://api.ipify.org"}"]`);
      if (found || foundNew || foundNew2) {
        foundNew2?.remove()
        found?.remove();
        foundNew?.remove()
        Window.HIKO && Window.HIKO.release && Window.HIKO.release();
      }
    };
  }, [baseUrl, path, shop, publicAccessToken, logout, refresh]);
  return <div ref={container}></div>
}