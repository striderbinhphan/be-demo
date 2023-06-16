import * as config from 'config';
import { createTypeOrmOptions } from './helper';

describe('createTypeOrmOptions', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('call next function', async () => {
    const spyConfig = jest.spyOn(config, 'get');
    spyConfig.mockReturnValue({});

    const result = createTypeOrmOptions('typeorm');
    expect(result).toEqual({});
  });
});
