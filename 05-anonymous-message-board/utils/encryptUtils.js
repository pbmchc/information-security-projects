import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export function encrypt(data) {
  return bcrypt.hash(data, SALT_ROUNDS);
}

export function compare(data, encrypted) {
  return bcrypt.compare(data, encrypted);
}
