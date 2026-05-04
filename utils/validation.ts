import { getCMSText } from './cms';

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return getCMSText('validation.emailRequired');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return getCMSText('validation.emailInvalid');
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return getCMSText('validation.passwordRequired');
  }
  if (password.length < 6) {
    return getCMSText('validation.passwordMinLength');
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return getCMSText('validation.nameRequired');
  }
  if (name.length < 2) {
    return getCMSText('validation.nameMinLength');
  }
  return null;
};
