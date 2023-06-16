import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConfig } from '../config';

export function createTypeOrmOptions(uriConfigPath: string): TypeOrmModuleOptions | unknown {
  const typeormOptions = getConfig().get(uriConfigPath);
  return typeormOptions;
}
