'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Registry;

var _minDash = require('min-dash');

var _types = require('./types');

var _descriptorBuilder = require('./descriptor-builder');

var _descriptorBuilder2 = _interopRequireDefault(_descriptorBuilder);

var _ns = require('./ns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A registry of Moddle packages.
 *
 * @param {Array<Package>} packages
 * @param {Properties} properties
 */
function Registry(packages, properties) {
  this.packageMap = {};
  this.typeMap = {};

  this.packages = [];

  this.properties = properties;

  (0, _minDash.forEach)(packages, (0, _minDash.bind)(this.registerPackage, this));
}

Registry.prototype.getPackage = function (uriOrPrefix) {
  return this.packageMap[uriOrPrefix];
};

Registry.prototype.getPackages = function () {
  return this.packages;
};

Registry.prototype.registerPackage = function (pkg) {

  // copy package
  pkg = (0, _minDash.assign)({}, pkg);

  var pkgMap = this.packageMap;

  ensureAvailable(pkgMap, pkg, 'prefix');
  ensureAvailable(pkgMap, pkg, 'uri');

  // register types
  (0, _minDash.forEach)(pkg.types, (0, _minDash.bind)(function (descriptor) {
    this.registerType(descriptor, pkg);
  }, this));

  pkgMap[pkg.uri] = pkgMap[pkg.prefix] = pkg;
  this.packages.push(pkg);
};

/**
 * Register a type from a specific package with us
 */
Registry.prototype.registerType = function (type, pkg) {

  type = (0, _minDash.assign)({}, type, {
    superClass: (type.superClass || []).slice(),
    extends: (type.extends || []).slice(),
    properties: (type.properties || []).slice(),
    meta: (0, _minDash.assign)(({}, type.meta || {}))
  });

  var ns = (0, _ns.parseName)(type.name, pkg.prefix),
      name = ns.name,
      propertiesByName = {};

  // parse properties
  (0, _minDash.forEach)(type.properties, (0, _minDash.bind)(function (p) {

    // namespace property names
    var propertyNs = (0, _ns.parseName)(p.name, ns.prefix),
        propertyName = propertyNs.name;

    // namespace property types
    if (!(0, _types.isBuiltIn)(p.type)) {
      p.type = (0, _ns.parseName)(p.type, propertyNs.prefix).name;
    }

    (0, _minDash.assign)(p, {
      ns: propertyNs,
      name: propertyName
    });

    propertiesByName[propertyName] = p;
  }, this));

  // update ns + name
  (0, _minDash.assign)(type, {
    ns: ns,
    name: name,
    propertiesByName: propertiesByName
  });

  (0, _minDash.forEach)(type.extends, (0, _minDash.bind)(function (extendsName) {
    var extended = this.typeMap[extendsName];

    extended.traits = extended.traits || [];
    extended.traits.push(name);
  }, this));

  // link to package
  this.definePackage(type, pkg);

  // register
  this.typeMap[name] = type;
};

/**
 * Traverse the type hierarchy from bottom to top,
 * calling iterator with (type, inherited) for all elements in
 * the inheritance chain.
 *
 * @param {Object} nsName
 * @param {Function} iterator
 * @param {Boolean} [trait=false]
 */
Registry.prototype.mapTypes = function (nsName, iterator, trait) {

  var type = (0, _types.isBuiltIn)(nsName.name) ? { name: nsName.name } : this.typeMap[nsName.name];

  var self = this;

  /**
   * Traverse the selected trait.
   *
   * @param {String} cls
   */
  function traverseTrait(cls) {
    return traverseSuper(cls, true);
  }

  /**
   * Traverse the selected super type or trait
   *
   * @param {String} cls
   * @param {Boolean} [trait=false]
   */
  function traverseSuper(cls, trait) {
    var parentNs = (0, _ns.parseName)(cls, (0, _types.isBuiltIn)(cls) ? '' : nsName.prefix);
    self.mapTypes(parentNs, iterator, trait);
  }

  if (!type) {
    throw new Error('unknown type <' + nsName.name + '>');
  }

  (0, _minDash.forEach)(type.superClass, trait ? traverseTrait : traverseSuper);

  // call iterator with (type, inherited=!trait)
  iterator(type, !trait);

  (0, _minDash.forEach)(type.traits, traverseTrait);
};

/**
 * Returns the effective descriptor for a type.
 *
 * @param  {String} type the namespaced name (ns:localName) of the type
 *
 * @return {Descriptor} the resulting effective descriptor
 */
Registry.prototype.getEffectiveDescriptor = function (name) {

  var nsName = (0, _ns.parseName)(name);

  var builder = new _descriptorBuilder2.default(nsName);

  this.mapTypes(nsName, function (type, inherited) {
    builder.addTrait(type, inherited);
  });

  var descriptor = builder.build();

  // define package link
  this.definePackage(descriptor, descriptor.allTypes[descriptor.allTypes.length - 1].$pkg);

  return descriptor;
};

Registry.prototype.definePackage = function (target, pkg) {
  this.properties.define(target, '$pkg', { value: pkg });
};

///////// helpers ////////////////////////////

function ensureAvailable(packageMap, pkg, identifierKey) {

  var value = pkg[identifierKey];

  if (value in packageMap) {
    throw new Error('package with ' + identifierKey + ' <' + value + '> already defined');
  }
}