import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as config from 'config';
export const CONFIG = 'ConfigProviderToken';

export const configProvider: Provider = {
  provide: CONFIG,
  useFactory: () => {
    dotenv.config();
    return import('config');
  },
};

export const getConfig = () => {
  return config;
};
