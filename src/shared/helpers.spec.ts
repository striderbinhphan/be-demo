import { Like } from 'typeorm';
import { removeEmptyAndApplyTypeOrmOperator } from './helpers';

describe('helpers', () => {
  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('removeEmptyAndApplyTypeOrmOperator', () => {
    it('should remove empty', (done) => {
      // prepare
      const mockedObjectInput = {
        employee: {
          email: 'test@gmail.com',
          phone: '0111111111',
        },
        status: 'pending',
      };
      const mockedEQExceptionsInput = ['status'];
      const expectedOutput = {
        employee: {
          email: Like(`%${mockedObjectInput.employee.email}%`),
          phone: Like(`%${mockedObjectInput.employee.phone}%`),
        },
        status: mockedObjectInput.status,
      };
      // action
      const res: any = removeEmptyAndApplyTypeOrmOperator(
        mockedObjectInput,
        mockedEQExceptionsInput,
      );

      // assert
      expect(res?.employee).toEqual(expectedOutput.employee);
      done();
    });
  });
});
