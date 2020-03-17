'use strict';
const AWS = require('aws-sdk');
const accountIam = new AWS.IAM();
const Users = require('./users');
const { withStatusCode } = require('../utils/response');
const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'index' });
const successStatus = withStatusCode(200, JSON.stringify);
const failStatus = withStatusCode(500, JSON.stringify);

module.exports.listUsers = async event => {
  let usersResult;

  const users = new Users(accountIam);
  try {
    usersResult = await users.listUsers();
  }
  catch (err) {
    failStatus({
      Data: err
    });
  }
  
  return successStatus({
    Data: usersResult
  });
};
