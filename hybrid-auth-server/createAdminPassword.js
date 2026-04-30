// createAdminPassword.js
const bcrypt = require('bcryptjs');

const [plain] = process.argv.slice(2);
if (!plain) {
  console.error('Usage: node createAdminPassword.js <plain-text-password>');
  process.exit(1);
}

const saltRounds = 12;
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(plain, salt);
console.log(hash);
