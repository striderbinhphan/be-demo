import { Like } from 'typeorm';

export function removeEmptyAndApplyTypeOrmOperator(object: any, equalExceptions: string[]) {
  const newObj = {};
  Object.keys(object).forEach((k) => {
    if (object[k] === Object(object[k])) newObj[k] = removeEmptyAndApplyTypeOrmOperator(object[k], equalExceptions);
    else if (object[k] !== undefined && !equalExceptions.includes(k))
      newObj[k] = Like(`%${object[k]}%`);
    else if (object[k] !== undefined) newObj[k] = object[k];
  });
  return newObj;
}
