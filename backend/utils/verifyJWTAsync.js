const jwt = require('jsonwebtoken');
const util = require('util');

const verifyJWTAsync = util.promisify(jwt.verify);

module.exports = verifyJWTAsync;
