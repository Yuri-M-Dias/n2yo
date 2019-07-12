"use strict";

require("./support/setup.js");
const N2YO = require("../");
let chai = require("chai"),
    expect = chai.expect,
    should = chai.should(),
    assert = chai.assert;

const ISS_NORAD_ID = "25544";
const apikey = process.env.N2YO_API_KEY;

describe("API client", function() {
    let client = null;
    beforeEach(() => {
        client = new N2YO.Client(apikey);
    });
    describe("should have an apikey", function() {
        it("and it needs to be default", function() {
            const definedApikey = client.applyDefaultRequestParams();
            const clientApikey = client.axios.defaults.params;
            clientApikey.should.equal(definedApikey.params);
        });
        it("and it needs to be valid", function() {
            const clientApikey = client.axios.defaults.params;
            // TODO?
        });
        it("and it should return an error if invalid", function() {});
    });
    describe("should be able to request TLEs", function() {
        it("and needs a NORAD ID", function() {
            const tlePromise = client.getTLE();
            return tlePromise.should.be.rejectedWith(Error);
        });
        it("and can make a GET to TLE", function() {
            const tlePromise = client.getTLE(ISS_NORAD_ID);
            return Promise.all([
                tlePromise.should.not.eventually.have.property("error"),
                tlePromise.should.eventually.have.property("data")
            ]);
        });
        it("and can GET the ISS TLE", async function() {
            const tlePromise = client.getTLE(ISS_NORAD_ID);
            tlePromise.should.be.fulfilled;
            const tleResult = await tlePromise;
            tleResult.data.should.not.have.property("error");
            tleResult.data.should.have.property("info");
            const resultInfo = tleResult.data.info;
            const expectedInfo = {
                satid: 25544,
                satname: "SPACE STATION",
                transactionscount: client.transactionsCount
            };
            resultInfo.should.deep.equal(expectedInfo);
            const resultTLE = tleResult.data.tle;
            //TODO: TLE validation?
            let firstLine = resultTLE.split("\r\n")[0].split(" ");
            let secondLine = resultTLE.split("\r\n")[1].split(" ");
            const expectedNORAD_ID = "25544U";
            expect(firstLine[1]).to.equal(expectedNORAD_ID);
        });
    });
    describe("should be able to get future satellite positions", function() {
        it("and needs id, position and timing information", function() {
            const requestPromise = client.getPositions();
            return requestPromise.should.be.rejectedWith(Error);
        });
        it("and can make a GET to positions", async function() {
            const lat = 41.702,
                lon = -76.114,
                alt = 1,
                seconds = 2;
            const requestPromise = client.getPositions(
                ISS_NORAD_ID,
                seconds,
                lat,
                lon,
                alt
            );
            requestPromise.should.be.fulfilled;
            requestPromise.should.not.eventually.have.property("error");
            requestPromise.should.eventually.have.property("data");
            const requestResult = await requestPromise;
            const resultInfo = requestResult.data.info;
            const expectedInfo = {
                satid: 25544,
                satname: "SPACE STATION",
                transactionscount: client.transactionsCount
            };
            resultInfo.should.deep.equal(expectedInfo);
            const resultPositions = requestResult.data.positions;
            expect(resultPositions.length).to.equal(seconds);
        });
    });
    describe("should be able to get visual passes", function() {
        it("and needs id, position and timing information", function() {
            const requestPromise = client.getVisualPasses();
            return requestPromise.should.be.rejectedWith(Error);
        });
        it("and can make a GET to visual passes", async function() {
            const lat = 41.702,
                lon = -76.114,
                alt = 0,
                days = 2,
                min_visibility = 300;
            const requestPromise = client.getVisualPasses(
                ISS_NORAD_ID,
                days,
                min_visibility,
                lat,
                lon,
                alt
            );
            requestPromise.should.be.fulfilled;
            requestPromise.should.not.eventually.have.property("error");
            requestPromise.should.eventually.have.property("data");
            const requestResult = await requestPromise;
            const resultInfo = requestResult.data.info;
            const resultPasses = requestResult.data.passes;
            const expectedInfo = {
                passescount: resultPasses.length,
                satid: 25544,
                satname: "SPACE STATION",
                transactionscount: client.transactionsCount
            };
            resultInfo.should.deep.equal(expectedInfo);
            // How to test?
        });
    });
    describe("should be able to get radio passes", function() {
        it("and needs id, position and timing information", function() {
            const requestPromise = client.getRadioPasses();
            return requestPromise.should.be.rejectedWith(Error);
        });
        it("and can make a GET to radio passes", async function() {
            const lat = 41.702,
                lon = -76.114,
                alt = 0,
                days = 2,
                min_elevation = 40;
            const requestPromise = client.getRadioPasses(
                ISS_NORAD_ID,
                days,
                min_elevation,
                lat,
                lon,
                alt
            );
            requestPromise.should.be.fulfilled;
            requestPromise.should.not.eventually.have.property("error");
            requestPromise.should.eventually.have.property("data");
            const requestResult = await requestPromise;
            const resultInfo = requestResult.data.info;
            const resultPasses = requestResult.data.passes;
            const expectedInfo = {
                passescount: resultPasses.length,
                satid: 25544,
                satname: "SPACE STATION",
                transactionscount: client.transactionsCount
            };
            resultInfo.should.deep.equal(expectedInfo);
            // How to test?
        });
    });
    describe("should be able to get above satellites", function() {
        it("and needs position, radius and a category", function() {
            const requestPromise = client.getAbove();
            return requestPromise.should.be.rejectedWith(Error);
        });
        it("and can make a GET to above satellites", async function() {
            const lat = 41.702,
                lon = -76.114,
                alt = 0,
                radius = 70,
                category_id = 18; // AMSAT
            const requestPromise = client.getAbove(
                radius,
                category_id,
                lat,
                lon,
                alt
            );
            requestPromise.should.be.fulfilled;
            requestPromise.should.not.eventually.have.property("error");
            requestPromise.should.eventually.have.property("data");
            const requestResult = await requestPromise;
            const resultInfo = requestResult.data.info;
            const resultAbove = requestResult.data.above;
            const expectedInfo = {
                category: "Amateur radio",
                satcount: resultAbove.length,
                transactionscount: client.transactionsCount
            };
            resultInfo.should.deep.equal(expectedInfo);
            // How to test?
        });
    });
});
