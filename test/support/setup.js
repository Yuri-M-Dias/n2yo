"use strict";

const N2YO = require('../../');
var chai = require("chai"),
    expect = chai.expect,
    should = chai.should(),
    assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");

chai.should();
chai.use(chaiAsPromised);

const ISS_NORAD_ID = '25544';
