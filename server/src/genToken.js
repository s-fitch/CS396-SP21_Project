const jwt = require('jsonwebtoken');
const data = require('../config/data.json');
require("dotenv").config();

const account = data['accounts'][0]

const access_token = jwt.sign(
    { _id: account._id, iat: Math.floor(Date.now() / 1000)},
    process.env.ACCESS_TOKEN_SECRET
);
const refresh_token = jwt.sign(
    { email: account.email, password: account.password, iat: Math.floor(Date.now() /1000)},
    process.env.REFRESH_TOKEN_SECRET
);
const expired_access = jwt.sign(
    { _id: account._id, iat: Math.floor(Date.now() / 1000)},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: '1s'}
);
const expired_refresh = jwt.sign(
    { email: account.email, password: account.password, iat: Math.floor(Date.now() / 1000)},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: '1s'}
);

console.log('\nPermanent ACCESS_TOKEN:\n' + access_token);
console.log('\nPermanent REFRESH_TOKEN:\n' + refresh_token);
console.log('\nExpired ACCESS_TOKEN:\n' + expired_access);
console.log('\nExpired REFRESH_TOKEN:\n' + expired_refresh);