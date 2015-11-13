'use strict';

var _ = require('./hlib/hlib');
var parser = require('./pigeon-parser');
var doctypes = require('./etc/doctypes');

/**
 * Traverses a JS object, and "compiles" into HTML.
 * @param {Object} obj 
 * @return {String} HTML string
 * @api public
 */

function build(obj) {
  
  var html = [];
  var keys = _.keys(obj);
  var keysLength = keys.length;
  
  for (var i = 0, key; key = keys[i], i < keysLength; i++) {
    
    var value = obj[key];
    
    if (key === '_') {
      html[i] = doctypes[value];
      continue;
    }
    
    if (_.isObj(value)) {
      html[i] = createNode(key, build(value));
    }
    
    if (_.isString(value)) {
      html[i] = createNode(key, value);
    }
    
    if (_.isFunc(value)) {
      html[i] = createNode(key, value());
    }
    
    if (_.isArray(value)) {
      html[i] = createNode(key, buildArray(value));
    }
    
  }
  
  return html.join('');
  
}

/**
 * Takes an array of objects and "compiles" into html
 * @param {Array} array
 * @return {String} HTML string
 * @api private
 */

function buildArray(array) {
  
  var arrayLength = array.length;
  var inner = [];
  
  for (var i = 0, item; item = array[i], i < arrayLength; i++) {
    
    if (_.isObj(item)) {
      var itemKey = _.keys(item)[0];
      var itemValue = _.isObj(item[itemKey]) ? build(item[itemKey]) :
      item[itemKey];
      inner[i] = createNode(itemKey, itemValue);
    }
  }
  
  return inner.join('');
  
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
  return '<' + t.tag + spacer + t.attributes + '>' + String(children) +
  '</' + t.tag + '>';
  
}

module.exports = build;
