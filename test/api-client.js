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
            let firstLine = resultTLE.split('\r\n')[0].split(' ');
            let secondLine = resultTLE.split('\r\n')[1].split(' ');
            const expectedNORADID = '25544U';
            expect(firstLine[1]).to.equal(expectedNORADID);
        });
    });
    describe("should be able to get future satellite positions", function() {
        it("and needs id, position and timing information", function() {
            const requestPromise = client.getPositions();
            return requestPromise.should.be.rejectedWith(Error);
        });
    });
    describe("should be able to get visual passes", function() {
        it("and needs id, position and timing information", function() {
            const requestPromise = client.getVisualPasses();
            return requestPromise.should.be.rejectedWith(Error);
        });
    });
    describe("should be able to get radio passes", function() {
        it("and needs id, position and timing information", function() {
            const requestPromise = client.getRadioPasses();
            return requestPromise.should.be.rejectedWith(Error);
        });
    });
    describe("should be able to get above satellites", function() {
        it("and needs position, radius and a category", function() {
            const requestPromise = client.getAbove();
            return requestPromise.should.be.rejectedWith(Error);
        });
    });
});
