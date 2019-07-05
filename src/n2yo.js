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
    this.axios = axios.create({
      baseURL : this.baseURL,
      timeout : 1000,
      params : {apiKey : this.apikey},
      transformResponse : [this.updateTransactionsCount]
    });
  }

  /**
   * Updates the know transactions limit from response data
   */
  updateTransactionsCount(data) {
    console.log([ "Received: ", data ]);
    if (data.info) {
      this.transactionsCount = data.info.transactionscount;
    }
    return data;
  }

  async tle(noradID) {
    return this.axios.get('/tle/' + noradID, {params : {apiKey : this.apikey}});
  }

}

exports.Client = Client;
