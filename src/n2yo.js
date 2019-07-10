"use strict";

const axios = require("axios");
const dotenv = require("dotenv").config();

/**
 * N2YO API wrapper
 */
class Client {
    /**
     * Constructs the client
     */
    constructor(apikey, baseURL, options) {
        this.apikey = apikey;
        this.baseURL =
            baseURL ||
            process.env.N2YO_API_URL ||
            "https://www.n2yo.com/rest/v1/satellite/";
        this.options = options || {};
        this.transactionsCount = 0;
        this.instanceAxios();
    }

    instanceAxios() {
        this.defaultRequestParams = { apiKey: this.apikey };
        let transformResponseHandlers = axios.defaults.transformResponse.concat(
            this.updateTransactionsCount.bind(this)
        );

        this.axios = axios.create({
            baseURL: this.baseURL,
            headers: {
                "Content-Type": "application/json"
            },
            // timeout : 1000,
            params: this.defaultRequestParams, // Not working?
            transformResponse: transformResponseHandlers
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

    /**
     * Applies the default apikey param to the desired params
     * Needed because the Axios defaultParams aren't working
     */
    applyDefaultRequestParams(params = {}) {
        return Object.assign(params, { params: this.defaultRequestParams });
    }

    /**
     * Retrieve the Two Line Elements (TLE) for a satellite identified by NORAD
     * id.
     */
    async getTLE(noradID) {
        if (!noradID) return Promise.reject(new Error("Need a valid NORAD ID"));
        let params = this.applyDefaultRequestParams();
        // Format TLE?
        return this.axios.get("/tle/" + noradID, params);
    }
}

exports.Client = Client;
