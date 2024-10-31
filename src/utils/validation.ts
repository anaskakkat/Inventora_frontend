export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validateTextField = (text: string): boolean => {
  const textRegex = /^(?!\s*$)[A-Za-z\d\s]+$/;
  return textRegex.test(text.trim());
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?!.*\s)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateMobileNumber= (mobile: string): boolean => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};
