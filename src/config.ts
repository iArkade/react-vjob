import { AuthStrategy } from '@/lib/auth/strategy';
import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export const config = {
     site: {
          name: 'Devias Kit Pro',
          description: '',
          colorScheme: 'light',
          themeColor: '#090a0b',
          primaryColor: 'neonBlue',
          url: getSiteURL(),
          version: import.meta.env.VITE_SITE_VERSION || '0.0.0',
     },
     logLevel: import.meta.env.VITE_LOG_LEVEL || LogLevel.ALL,
     auth: { strategy: import.meta.env.VITE_AUTH_STRATEGY || AuthStrategy.CUSTOM },
     auth0: { domain: import.meta.env.VITE_AUTH0_DOMAIN, clientId: import.meta.env.VITE_AUTH0_CLIENT_ID },
};
