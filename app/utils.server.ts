import {auth, GoogleAuth} from 'google-auth-library';

export async function createAuthClient() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const authClient = await auth.getClient();
  return authClient;
}
