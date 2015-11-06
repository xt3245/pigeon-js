var hlib = require('./hlib/hlib');
var parser = require('./pigeon-parser');
var doctypes = require('./etc/doctypes.js');

/**
 * Traverses a JS object, and "compiles" into HTML.
 * @param {Object} obj 
 * @return {String} HTML string
 * @api public
 */

function build(obj) {

  var html = '';
  var keys = hlib.keys(obj);
  var keysLength = keys.length;

  for (var i = 0, key; key = keys[i], i < keysLength; i++) {

    var value = obj[key];

    if (key === '_') {
      html += doctypes[value];
      continue;
    }

    if (hlib.isObj(value)) {
      html += createNode(key, build(value));
    }

    if (hlib.isString(value)) {
      html += createNode(key, value);
    }

    if (hlib.isFunc(value)) {
      html += createNode(key, value());
    }
    
    if (hlib.isArray(value)) {
      html += createNode(key, buildArray(value));
    }
    
  }

  return html;

}

/**
 * Takes an array of objects and "compiles" into html
 * @param {Array} array
 * @return {String} HTML string
 * @api private
 */

function buildArray(array) {
  
  var arrayLength = array.length;
  var inner = '';
  
  for (var i = 0, item; item = array[i], i < arrayLength; i++) {
    
    if (hlib.isObj(item)) {
      var itemKey = hlib.keys(item)[0];
      var itemValue = hlib.isObj(item[itemKey]) 
        ? build(item[itemKey]) 
        : item[itemKey];
      inner += createNode(itemKey, itemValue);
    }
  }
  
  return inner;
  
}

/**
 * Creates an HTML DOM node.
 * @param {String} string An attribute string, for example `.class#id`
 * @param {String} children Children of HTML DOM node.
 * @return {String} 
 * @api private
 */

function createNode(string, children) {
  
  var t = parser(string);
  var spacer = t.attributes ? ' ' : '';
  return '<' + t.tag + spacer + t.attributes + '>' + children.toString() + '</' + t.tag + '>';
  
}

module.exports = {
  build: build
};