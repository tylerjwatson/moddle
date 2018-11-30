'use strict';

var _expect = require('../expect');

var _expect2 = _interopRequireDefault(_expect);

var _ns = require('../../lib/ns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ns', function () {

  describe('parseName', function () {

    it('should parse namespaced name', function () {
      (0, _expect2.default)((0, _ns.parseName)('asdf:bar')).to.jsonEqual({
        name: 'asdf:bar',
        prefix: 'asdf',
        localName: 'bar'
      });
    });

    it('should parse localName (with default ns)', function () {
      (0, _expect2.default)((0, _ns.parseName)('bar', 'asdf')).to.jsonEqual({
        name: 'asdf:bar',
        prefix: 'asdf',
        localName: 'bar'
      });
    });

    it('should parse non-ns name', function () {
      (0, _expect2.default)((0, _ns.parseName)('bar')).to.jsonEqual({
        name: 'bar',
        prefix: undefined,
        localName: 'bar'
      });
    });

    it('should handle invalid input', function () {
      (0, _expect2.default)(function () {
        (0, _ns.parseName)('asdf:foo:bar');
      }).to.throw();
    });
  });
});