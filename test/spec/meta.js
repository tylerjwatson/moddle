'use strict';

var _expect = require('../expect');

var _expect2 = _interopRequireDefault(_expect);

var _helper = require('../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('meta', function () {

  var createModel = (0, _helper.createModelBuilder)('test/fixtures/model/');
  var model = createModel(['meta']);

  it('should have the "meta" attribute', function () {

    // when
    var meta = model.getTypeDescriptor('c:Car').meta;

    // then
    (0, _expect2.default)(meta).to.exist;
    (0, _expect2.default)(meta).to.be.an('object');
  });

  it('should have a "owners" property inside "meta"', function () {

    // when
    var meta = model.getTypeDescriptor('c:Car').meta;

    // then
    (0, _expect2.default)(meta.owners).to.exist;
    (0, _expect2.default)(meta.owners).to.eql(['the pope', 'donald trump']);
  });
});