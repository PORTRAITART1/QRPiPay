const bcrypt = require('bcryptjs');

class SecurityService {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateAmount(amount) {
    return amount > 0 && amount <= 1000000; // Max 1M Pi
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 500); // Max 500 chars
  }
}

module.exports = new SecurityService();
