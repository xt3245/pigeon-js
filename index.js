'use strict';

/**
 * Pigeon JS
 * Dependencies 
 */

var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var pigeon = require('./lib/pigeon');
var template = require('./lib/pigeon-template');

/**
 * Version 
 * @api public
 */

exports.version = '0.2.0';

/**
 * Cache stores strings of html
 * So an object doesn't need to be "compiled", every single time
 * @api public
 */

exports.cache = {};

/**
 * Stores vars, and function for later use. 
 * @api public
 */

exports.storage = {};

/**
 * Compiles an object to html
 * @param {Object} obj
 * @return {String}
 * @api private 
 */

function compile(obj) {
  return pigeon(obj);
}

/**
 * Handles all options before returning the html string
 * 
 * @param {Object} obj  
 * @param {Object} options
 * @return {String}
 * @api private
 */

function handle(obj, options) {
  
  if (options.cache && exports.cache[key]) {
    return exports.cache[key];
  }
  
  var html = compile(obj);
  
  if (!options.cache) {
    return html;
  }
  
  var key = options.name;
  
  if (options.cache && !exports.cache[key]) {
    exports.cache[key] = html;
    return exports.cache[key];
  }
  
}

/**
 * @param {String} path
 * @param {Object|Function} options
 * @param {Function} callback
 * @return {String} 
 * @api public
 */

exports.renderFromYAML = function(path, options, callback) {
  
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  
  options = options || {};
  options.name = path;
  
  callback = (typeof callback === 'function') ? callback : function() {};
  
  try {
    var obj = jsyaml.safeLoad(fs.readFileSync(path, 'utf8'));
    var html = handle(obj, options);
    
    if (options.data) {
      html = template(html, options.data);
    }
    
    callback(null, html);
    return html;
    
  } catch (e) {
    return callback(e, null);
  }
  
};

/**
 * @param {Object} obj
 * @param (Object|Function} options
 * @param {Function} callback
 * @return {String}
 * @api public
 */

exports.render = function(obj, options, callback) {
  
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  
  options = options || {};
  callback = (typeof callback === 'function') ? callback : function() {};
  
  options.cache = (options.cache && options.name) ? true : false;
  
  if (obj !== null && typeof obj === 'object') {
    var html = handle(obj, options);
    callback(null, html);
    return html;
  } else {
    var e = new TypeError('Expected an object');
    return callback(e, null);
  }
  
};

/**
 * @return {Boolean} 
 * @api public
 */

exports.flush = function() {
  exports.cache = {};
  exports.storage = {};
  return true;
};
