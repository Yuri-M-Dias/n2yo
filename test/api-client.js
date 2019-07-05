'use strict';

const N2YO = require('../');

var assert = require('assert');

describe('API cleint', function() {
  describe('should be able to make GET requests', function() {
    it('get a TLE', async function() {
      const client = new N2YO.Client(process.env.N2YO_API_KEY);
      const NORAD_ID = '25544';
      const result = await client.tle(NORAD_ID);
      console.log([ 'GET', result ]);
      const changedTransactions = client.transactionsCount;
      assert.equal(changedTransactions, 1);
    });
  });
});
