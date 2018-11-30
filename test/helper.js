'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readFile = readFile;
exports.createModelBuilder = createModelBuilder;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minDash = require('min-dash');

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readFile(filename) {
  return _fs2.default.readFileSync(filename, { encoding: 'UTF-8' });
}

function createModelBuilder(base) {

  var cache = {};

  if (!base) {
    throw new Error('[test-util] must specify a base directory');
  }

  function createModel(packageNames) {

    var packages = (0, _minDash.map)(packageNames, function (f) {
      var pkg = cache[f];
      var file = base + f + '.json';

      if (!pkg) {
        try {
          pkg = cache[f] = JSON.parse(readFile(base + f + '.json'));
        } catch (e) {
          throw new Error('[Helper] failed to parse <' + file + '> as JSON: ' + e.message);
        }
      }

      return pkg;
    });

    return new _2.default(packages);
  }

  return createModel;
}