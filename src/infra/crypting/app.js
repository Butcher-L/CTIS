const crypto = require('crypto'),
  algorithm = "aes-256-gcm",
  password = "3zTvzr3p67VC61jmV54rIYu1545x4TlY",
  // do not use a global iv for production,
  // generate a new one for each encryption
  iv = "60iP0h6vJoEa";

function encrypt(text) {
  var cipher = crypto.createCipheriv(algorithm, password, iv);
  var encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  var tag = cipher.getAuthTag();
  return encrypted;
}

function decrypt(encrypted) {
  var decipher = crypto.createDecipheriv(algorithm, password, iv);
  var dec = decipher.update(encrypted, "hex", "utf8");
  return dec;
}

function checkMatch(password, recordedPassword){
  return (encrypt(password) === recordedPassword)
}

module.exports = { encrypt, decrypt, checkMatch };
