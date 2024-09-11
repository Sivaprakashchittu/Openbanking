const validateRegisterInput = (username, password, confirmPassword, email) => {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }
    // Additional validation can be added here
  };
  
  module.exports = {
    validateRegisterInput,
  };
  