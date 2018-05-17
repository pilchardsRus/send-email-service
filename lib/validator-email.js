import * as isEmail from 'isemail';

let predicate = value => isEmail.validate(value);
export const validateIsEmailV= predicate;