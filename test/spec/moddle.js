'use strict';

var _expect = require('../expect');

var _expect2 = _interopRequireDefault(_expect);

var _helper = require('../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('moddle', function () {

      var createModel = (0, _helper.createModelBuilder)('test/fixtures/model/');

      describe('base', function () {

            var model = createModel(['properties']);

            it('should provide types', function () {

                  // when
                  var ComplexType = model.getType('props:Complex');
                  var SimpleBody = model.getType('props:SimpleBody');
                  var Attributes = model.getType('props:Attributes');

                  // then
                  (0, _expect2.default)(ComplexType).to.exist;
                  (0, _expect2.default)(SimpleBody).to.exist;
                  (0, _expect2.default)(Attributes).to.exist;
            });

            it('should provide packages by prefix', function () {

                  // when
                  var propertiesPackage = model.getPackage('props');

                  // then
                  (0, _expect2.default)(propertiesPackage).to.exist;
                  (0, _expect2.default)(propertiesPackage.name).to.equal('Properties');
                  (0, _expect2.default)(propertiesPackage.uri).to.equal('http://properties');
                  (0, _expect2.default)(propertiesPackage.prefix).to.equal('props');
            });

            it('should provide packages by uri', function () {

                  // when
                  var propertiesPackage = model.getPackage('http://properties');

                  // then
                  (0, _expect2.default)(propertiesPackage).to.exist;
                  (0, _expect2.default)(propertiesPackage.name).to.equal('Properties');
                  (0, _expect2.default)(propertiesPackage.uri).to.equal('http://properties');
                  (0, _expect2.default)(propertiesPackage.prefix).to.equal('props');
            });

            it('should provide type descriptor', function () {

                  // given
                  var expectedDescriptorNs = { name: 'props:Complex', prefix: 'props', localName: 'Complex' };

                  var expectedDescriptorProperties = [{
                        name: 'id',
                        type: 'String',
                        isAttr: true,
                        isId: true,
                        ns: { name: 'props:id', prefix: 'props', localName: 'id' },
                        inherited: true
                  }];

                  var expectedDescriptorPropertiesByName = {

                        'id': {
                              name: 'id',
                              type: 'String',
                              isAttr: true,
                              isId: true,
                              ns: { name: 'props:id', prefix: 'props', localName: 'id' },
                              inherited: true
                        },
                        'props:id': {
                              name: 'id',
                              type: 'String',
                              isAttr: true,
                              isId: true,
                              ns: { name: 'props:id', prefix: 'props', localName: 'id' },
                              inherited: true
                        }
                  };

                  // when
                  var ComplexType = model.getType('props:Complex');

                  var descriptor = model.getElementDescriptor(ComplexType);

                  // then
                  (0, _expect2.default)(descriptor).to.exist;
                  (0, _expect2.default)(descriptor.name).to.equal('props:Complex');

                  (0, _expect2.default)(descriptor.ns).to.jsonEqual(expectedDescriptorNs);
                  (0, _expect2.default)(descriptor.properties).to.jsonEqual(expectedDescriptorProperties);
                  (0, _expect2.default)(descriptor.propertiesByName).to.jsonEqual(expectedDescriptorPropertiesByName);
            });

            it('should provide type descriptor via $descriptor property', function () {

                  // given
                  var ComplexType = model.getType('props:Complex');
                  var expectedDescriptor = model.getElementDescriptor(ComplexType);

                  // when
                  var descriptor = ComplexType.$descriptor;

                  // then
                  (0, _expect2.default)(descriptor).to.equal(expectedDescriptor);
            });

            it('should provide model via $model property', function () {

                  // given
                  var ComplexType = model.getType('props:Complex');

                  // when
                  var foundModel = ComplexType.$model;

                  // then
                  (0, _expect2.default)(foundModel).to.equal(model);
            });

            describe('create', function () {

                  it('should provide meta-data', function () {

                        // when
                        var instance = model.create('props:BaseWithNumericId');

                        // then
                        (0, _expect2.default)(instance.$descriptor).to.exist;
                        (0, _expect2.default)(instance.$type).to.equal('props:BaseWithNumericId');
                  });
            });

            describe('createAny', function () {

                  it('should provide attrs + basic meta-data', function () {

                        // when
                        var anyInstance = model.createAny('other:Foo', 'http://other', {
                              bar: 'BAR'
                        });

                        // then
                        (0, _expect2.default)(anyInstance).to.jsonEqual({
                              $type: 'other:Foo',
                              bar: 'BAR'
                        });

                        (0, _expect2.default)(anyInstance.$instanceOf('other:Foo')).to.be.true;
                  });

                  it('should provide ns meta-data', function () {

                        // when
                        var anyInstance = model.createAny('other:Foo', 'http://other', {
                              bar: 'BAR'
                        });

                        // then
                        (0, _expect2.default)(anyInstance.$descriptor).to.jsonEqual({
                              name: 'other:Foo',
                              isGeneric: true,
                              ns: { prefix: 'other', localName: 'Foo', uri: 'http://other' }
                        });
                  });
            });

            describe('getType', function () {

                  it('should provide instantiatable type', function () {

                        // when
                        var SimpleBody = model.getType('props:SimpleBody');

                        var instance = new SimpleBody({ body: 'BAR' });

                        // then
                        (0, _expect2.default)(instance instanceof SimpleBody).to.be.true;
                        (0, _expect2.default)(instance.body).to.eql('BAR');
                  });
            });

            describe('instance', function () {

                  it('should query types via $instanceOf', function () {

                        // given
                        var instance = model.create('props:BaseWithNumericId');

                        // then
                        (0, _expect2.default)(instance.$instanceOf('props:BaseWithNumericId')).to.equal(true);
                        (0, _expect2.default)(instance.$instanceOf('props:Base')).to.equal(true);
                  });

                  it('should provide $type in instance', function () {

                        // given
                        var SimpleBody = model.getType('props:SimpleBody');

                        // when
                        var instance = new SimpleBody();

                        // then
                        (0, _expect2.default)(instance.$type).to.equal('props:SimpleBody');
                  });

                  it('should provide $descriptor in instance', function () {

                        // given
                        var SimpleBody = model.getType('props:SimpleBody');

                        // when
                        var instance = new SimpleBody();

                        // then
                        (0, _expect2.default)(instance.$descriptor).to.eql(SimpleBody.$descriptor);
                  });
            });

            describe('helpers', function () {

                  it('should get property descriptor', function () {
                        // given
                        var SimpleBody = model.getType('props:SimpleBody');

                        var instance = new SimpleBody();

                        // when
                        var body = model.getPropertyDescriptor(instance, 'props:body');

                        // then
                        (0, _expect2.default)(body).to.include.keys(['name', 'type', 'isBody', 'ns']);
                  });

                  it('should get type descriptor', function () {

                        // when
                        var simpleBody = model.getTypeDescriptor('props:SimpleBody');

                        // then
                        (0, _expect2.default)(simpleBody).to.include.keys(['name', 'superClass', 'properties']);
                  });
            });
      });

      describe('error handling', function () {

            it('should handle package redefinition', function () {

                  // given
                  function create() {

                        // when
                        createModel(['properties', 'properties']);
                  }

                  // then
                  (0, _expect2.default)(create).to.throw(/package with prefix <props> already defined/);
            });
      });
});