import { InternalServerErrorException } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('httpExceptionFilter', () => {
  let httpFilter: HttpExceptionFilter;

  beforeEach(() => {
    httpFilter = new HttpExceptionFilter();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should call http filter method', (done) => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const request = {
      method: 'method',
    };
    const host = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
        getResponse: jest.fn().mockReturnValue({ status }),
      }),
    };
    const expectedError = new InternalServerErrorException(['expected-method-name']);

    httpFilter.catch(expectedError, host as any);

    expect(status).toHaveBeenCalled();
    expect(json).toHaveBeenCalled();
    done();
  });
});
