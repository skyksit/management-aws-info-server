'use strict';

// tests for listUsers
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('listUsers', '/src/iam/handler.js', 'listUsers');

describe('listUsers', () => {
  before((done) => {
    done();
  });

  it('should return users data array', () => {
    return wrapped.run({}).then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).to.be.equal(200);
      expect(body.Data).to.have.lengthOf.above(1);
    });
  });
});