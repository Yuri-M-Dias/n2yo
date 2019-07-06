'use strict';

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/**
 * N2YO API wrapper
 */
class Client {

  /**
   * Constructs the client
   */
  constructor(apikey, baseURL, options) {
    this.apikey = apikey;
    this.baseURL = baseURL || process.env.N2YO_API_URL ||
                   'https://www.n2yo.com/rest/v1/satellite/';
    this.options = options || {};
    this.transactionsCount = 0;
    this.instanceAxios();
  }

  instanceAxios() {
    this.defaultRequestParams = {apiKey : this.apiKey};
    this.axios = axios.create({
      baseURL : this.baseURL,
      // timeout : 1000,
      params : this.defaultRequestParams,
      transformResponse : [this.updateTransactionsCount]
    });
  }

  /**
   * Updates the know transactions limit from response data
   */
  updateTransactionsCount(data) {
    if (data.info) {
      this.transactionsCount = data.info.transactionscount;
    }
    return data;
  }

  async tle(noradID) {
    let params = Object.assign({}, this.defaultRequestParams);
    // Format TLE?
    return this.axios.get('/tle/' + noradID);
  }

}

exports.Client = Client;
