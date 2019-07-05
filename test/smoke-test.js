'use strict';

const N2YO = require('../');
const apikey = process.env.N2YO_API_KEY;

var assert = require('assert');

describe('Client', function() {
  describe('intialize', function() {
    it('empty should work', function() {
      const client = new N2YO.Client();
      let resultingURL = client.baseURL;
      assert.equal(resultingURL, 'https://www.n2yo.com/rest/v1/satellite/');
      const resultingOptions = client.options;
    });

    it('define URL', function() {
      const client = new N2YO.Client({}, 'test');
      const resultingURL = client.baseURL;
      assert.equal(resultingURL, 'test');
    });

    it('should define API key', function() {
      const client = new N2YO.Client(apikey);
      const resultingkey = client.apikey;
      assert.equal(resultingkey, apikey);
    });

    it('should define axios', function() {
      const client = new N2YO.Client(apikey);
      const definedAxios = client.axios;
      assert.equal(definedAxios.getUri(), client.baseURL);
    });
  });
});
