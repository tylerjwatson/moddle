'use strict';

var _expect = require('../expect');

var _expect2 = _interopRequireDefault(_expect);

var _helper = require('../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('moddle', function () {

  var createModel = (0, _helper.createModelBuilder)('test/fixtures/model/');

  describe('extension', function () {

    var model = createModel(['extension/base', 'extension/custom']);

    describe('trait', function () {

      describe('descriptor', function () {

        it('should indicate non-inherited', function () {

          // given
          var ComplexType = model.getType('b:Root');

          // when
          var descriptor = model.getElementDescriptor(ComplexType),
              customAttrDescriptor = descriptor.propertiesByName['customAttr'],
              customBaseAttrDescriptor = descriptor.propertiesByName['customBaseAttr'],
              ownAttrDescriptor = descriptor.propertiesByName['ownAttr'];

          // then
          (0, _expect2.default)(customAttrDescriptor.inherited).to.be.false;
          (0, _expect2.default)(customBaseAttrDescriptor.inherited).to.be.false;
          (0, _expect2.default)(ownAttrDescriptor.inherited).to.be.true;
        });
      });

      it('should plug-in into type hierarchy', function () {

        var root = model.create('b:Root');

        // then
        (0, _expect2.default)(root.$instanceOf('c:CustomRoot')).to.be.true;
      });

      it('should add custom attribute', function () {

        // when
        var root = model.create('b:Root', {
          customAttr: -1
        });

        // then
        (0, _expect2.default)(root.customAttr).to.eql(-1);
      });

      it('should refine property', function () {
        // given
        var Type = model.getType('b:Root');

        // when
        var genericProperty = Type.$descriptor.propertiesByName['generic'];

        // then
        (0, _expect2.default)(genericProperty.type).to.eql('c:CustomGeneric');
      });

      it('should use refined property', function () {

        var customGeneric = model.create('c:CustomGeneric', { count: 100 });

        // when
        var root = model.create('b:Root', {
          generic: customGeneric
        });

        // then
        (0, _expect2.default)(root.generic).to.eql(customGeneric);
      });
    });

    describe('types', function () {

      it('should provide custom types', function () {

        var property = model.create('c:Property');

        // then
        (0, _expect2.default)(property.$instanceOf('c:Property')).to.be.true;
      });
    });

    describe('generic', function () {

      it('should extend Element', function () {

        // when
        var customGeneric = model.create('c:CustomGeneric', { count: 100 });

        // then
        (0, _expect2.default)(customGeneric.$instanceOf('Element')).to.be.true;
      });

      it('should be part of generic collection', function () {

        var customProperty = model.create('c:Property', { key: 'foo', value: 'bar' });

        // when
        var root = model.create('b:Root', {
          genericCollection: [customProperty]
        });

        // then
        (0, _expect2.default)(root.genericCollection).to.eql([customProperty]);
      });
    });
  });

  describe('property replacement', function () {

    var model = createModel(['replace']);

    it('should replace in descriptor', function () {

      // given
      var Extension = model.getType('r:Extension');

      // when
      var descriptor = model.getElementDescriptor(Extension),
          propertyNames = descriptor.properties.map(function (p) {
        return p.name;
      });

      // then
      (0, _expect2.default)(propertyNames).to.eql(['name', 'value', 'id']);

      (0, _expect2.default)(descriptor.propertiesByName['r:id'].type).to.eql('Integer');
      (0, _expect2.default)(descriptor.propertiesByName['id'].type).to.eql('Integer');
    });
  });

  describe('property redefinition', function () {

    var model = createModel(['redefine']);

    it('should redefine in descriptor', function () {

      // given
      var Extension = model.getType('r:Extension');

      // when
      var descriptor = model.getElementDescriptor(Extension),
          propertyNames = descriptor.properties.map(function (p) {
        return p.name;
      });

      // then
      (0, _expect2.default)(propertyNames).to.eql(['id', 'name', 'value']);

      (0, _expect2.default)(descriptor.propertiesByName['r:id'].type).to.eql('Integer');
      (0, _expect2.default)(descriptor.propertiesByName['id'].type).to.eql('Integer');
    });
  });
});