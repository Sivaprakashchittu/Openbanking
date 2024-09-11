// backend/utils/encryptPassword.js
const bcrypt = require('bcryptjs');

const encryptPassword = async (password) => {
    console.log("password",password)
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  encryptPassword,
  comparePassword,
};

