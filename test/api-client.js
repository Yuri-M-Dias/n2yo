"use strict";

require("./support/setup.js");
const N2YO = require("../");
var chai = require("chai"),
    expect = chai.expect,
    should = chai.should(),
    assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const ISS_NORAD_ID = "25544";
const apikey = process.env.N2YO_API_KEY;

describe("API client", function() {
    let client = null;
    describe("should have an apikey", function() {
        beforeEach(() => {
            client = new N2YO.Client(apikey);
        });
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
        beforeEach(() => {
            client = new N2YO.Client(apikey);
        });
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
            expect(resultInfo).to.deep.equal(expectedInfo);
        });
    });
});
