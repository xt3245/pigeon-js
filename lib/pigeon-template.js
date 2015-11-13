'use strict';

var _ = require('./hlib/hlib');

/**
 * TODO: add more functionality 
 * Currently, this function replaces all instances of a key 
 * with the data provided.
 * 
 * Example: 
 * `var data = {name: 'John', age: '20'}`
 * `var string = "{{name}} turns {{age}} today!"`
 * => John turns 20 today!
 * 
 * @param {String} str
 * @param {Object} locals
 * @return {String} 
 */

function template(str, locals) {
  
  str = String(str);
  var updated = {};
  
  for (var key in locals) {
    if (!locals.hasOwnProperty(key)) continue;
    updated['{{' + String(key) + '}}'] = locals[key];
  }
  
  var re = new RegExp(_.keys(updated)
  .join('|'), 'gi');
  
  return str.replace(re, function(matched) {
    return updated[matched];
  });
  
}

module.exports = template;