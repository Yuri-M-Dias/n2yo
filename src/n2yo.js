"use strict";

const axios = require("axios");
const dotenv = require("dotenv").config();

/**
 * N2YO API wrapper
 */
class Client {
    /**
     * Constructs the client class
     */
    constructor(
        apikey,
        baseURL,
        lat = null,
        lon = null,
        alt = null,
        tz = null // Time zone information?
    ) {
        this.apikey = apikey;
        this.baseURL =
            baseURL ||
            process.env.N2YO_API_URL ||
            "https://www.n2yo.com/rest/v1/satellite/";
        this.lat = lat;
        this.lon = lon;
        this.alt = alt;
        this.tz = tz;
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
    async getTLE(satid) {
        if (!satid) return Promise.reject(new Error("Need a valid NORAD ID"));
        let params = this.applyDefaultRequestParams();
        let requestPath = `/tle/${satid}`;
        // TODO: Format TLE?
        return this.axios.get(requestPath, params);
    }

    /**
     * Retrieve the future positions of any satellite as footprints (latitude, longitude) to display orbits on maps.
     * Also return the satellite's azimuth and elevation with respect to the observer location.
     * Each element in the response array is one second of calculation.
     * First element is calculated for current UTC time.
     */
    async getPositions(
        satid,
        seconds,
        lat = this.lat,
        lon = this.lon,
        alt = this.alt
    ) {
        if (!satid) return Promise.reject(new Error("Need a valid NORAD ID"));
        if (!seconds)
            return Promise.reject(
                new Error("Need a number of future positions to calculate")
            );
        if (lat == void 0 || lon == void 0 || alt == void 0)
            return Promise.reject(
                new Error("Need a valid latitude, longitude and altitude")
            );
        let params = this.applyDefaultRequestParams();
        let requestPath = `/positions/${satid}/${lat}/${lon}/${alt}/${seconds}`;
        return this.axios.get(requestPath, params);
    }

    /**
     * Get predicted visual passes for any satellite relative to a location on Earth.
     */
    async getVisualPasses(
        satid,
        days,
        min_visibility,
        lat = this.lat,
        lon = this.lon,
        alt = this.alt
    ) {
        if (!satid) return Promise.reject(new Error("Need a valid NORAD ID"));
        if (lat == void 0 || lon == void 0 || alt == void 0)
            return Promise.reject(
                new Error("Need a valid latitude, longitude and altitude")
            );
        if (!days)
            return Promise.reject(new Error("Need a valid number of days"));
        if (!min_visibility)
            return Promise.reject(
                new Error("Need a valid minimum seconds of visibility")
            );
        let params = this.applyDefaultRequestParams();
        let requestPath = `/visualpasses/${satid}/${lat}/${lon}/${alt}/${days}/${min_visibility}`;
        return this.axios.get(requestPath, params);
    }

    /**
     * The "radio passes" are similar to "visual passes", the only difference being the requirement for the objects to be optically visible for observers.
     */
    async getRadioPasses(
        satid,
        days,
        min_elevation,
        lat = this.lat,
        lon = this.lon,
        alt = this.alt
    ) {
        if (!satid) return Promise.reject(new Error("Need a valid NORAD ID"));
        if (lat == void 0 || lon == void 0 || alt == void 0)
            return Promise.reject(
                new Error("Need a valid latitude, longitude and altitude")
            );
        if (!days)
            return Promise.reject(new Error("Need a valid number of days"));
        if (!min_elevation)
            return Promise.reject(new Error("Need a valid minimum elevation"));
        let params = this.applyDefaultRequestParams();
        let requestPath = `/radiopasses/${satid}/${lat}/${lon}/${alt}/${days}/${min_elevation}`;
        return this.axios.get(requestPath, params);
    }

    /**
     * The "above" function will return all objects within a given search radius above observer's location.
     */
    async getAbove(
        search_radius,
        category_id, // TODO: enum? default ALL?
        lat = this.lat,
        lon = this.lon,
        alt = this.alt
    ) {
        if (!search_radius)
            return Promise.reject(new Error("Need search radius"));
        if (lat == void 0 || lon == void 0 || alt == void 0)
            return Promise.reject(
                new Error("Need a valid latitude, longitude and altitude")
            );
        if (!category_id)
            return Promise.reject(new Error("Need a valid category id"));
        let params = this.applyDefaultRequestParams();
        let requestPath = `/above/${lat}/${lon}/${alt}/${search_radius}/${category_id}`;
        return this.axios.get(requestPath, params);
    }
}

exports.Client = Client;
