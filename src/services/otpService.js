export const otpService = {
  // Validate Indian 10-digit mobile number
  validateMobile(mobile) {
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
      return { valid: true, cleaned };
    }
    return {
      valid: false,
      message: 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).'
    };
  }
};
