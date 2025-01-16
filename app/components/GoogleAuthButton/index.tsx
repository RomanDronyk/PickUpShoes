import {useCallback, useLayoutEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';
import {SocialLoginWidget} from './SocialLoginWidget';

const GoogleAuthButton = () => {
  const [envObj, setEnvObj] = useState<any>({});
  const [customer, setCustomer] = useState<
    {id: string; email: string; accessToken: string} | any
  >(null);
  const fetcher = useFetcher();
  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    fetch('/api/google/auth')
      .then((data) => data.json())
      .then((data) => setEnvObj(data));
  }, []);
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const Window: any = window;
      setCustomer(Window?.HIKO?.customer);
      setIsClient(true);
    }
  }, []);

  const handleCustomEvents = useCallback((event: any) => {
    if (['login', 'activate', 'multipass'].includes(event.detail.action)) {
      setCustomer(event.detail.customer);
    }
  }, []);

  useLayoutEffect(() => {
    if (customer && customer.accessToken) {
      const formData = new FormData();
      formData.append('accessToken', customer.accessToken);
      fetcher.submit(formData, {method: 'post', action: '/api/google/auth'});
    }
    return () => setCustomer(null);
  }, [customer]);

  useLayoutEffect(() => {
    document.addEventListener('hiko', handleCustomEvents);
    return () => document.removeEventListener('hiko', handleCustomEvents);
  }, []);
  return (
    <h1>
      <div className="relative ">
        {isClient && (
          <>
            <SocialLoginWidget
              shop={envObj?.publickStoreDomain || ''}
              publicAccessToken={envObj?.publickStoreFront || ''}
              baseUrl={envObj?.socialWidgetBaseUrl || ''}
              logout={(e: any) => {
                console.log(e);
              }}
              refresh={(e: any) => {
                console.log(e);
              }}
            />
          </>
        )}
      </div>
    </h1>
  );
};
export default GoogleAuthButton;
