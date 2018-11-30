'use strict';

var _expect = require('../expect');

var _expect2 = _interopRequireDefault(_expect);

var _types = require('../../lib/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Types', function () {

  describe('coerceType', function () {

    it('should convert Real', function () {
      (0, _expect2.default)((0, _types.coerceType)('Real', '420')).to.eql(420.0);
    });

    it('should convert Real (-0.01)', function () {
      (0, _expect2.default)((0, _types.coerceType)('Real', '-0.01')).to.eql(-0.01);
    });

    it('should convert Boolean (true)', function () {
      (0, _expect2.default)((0, _types.coerceType)('Boolean', 'true')).to.equal(true);
    });

    it('should convert Boolean (false)', function () {
      (0, _expect2.default)((0, _types.coerceType)('Boolean', 'false')).to.equal(false);
    });

    it('should convert Integer', function () {
      (0, _expect2.default)((0, _types.coerceType)('Integer', '12012')).to.equal(12012);
    });

    it('should NOT convert complex', function () {
      var complexElement = { a: 'A' };
      (0, _expect2.default)((0, _types.coerceType)('Element', complexElement)).to.equal(complexElement);
    });
  });
});