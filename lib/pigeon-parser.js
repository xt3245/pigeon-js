'use strict';

var _ = require('./hlib/hlib');

/**
 * Checks if a token is an identity token (. # [ ])
 * @param {String} t Token
 * @return {Boolean}
 */

function isIdentityToken(t) {
  return (t === '.' || t === '#' || t === '[' || t === ']');
}

/**
 * Parses a string into html attributes.
 * @param {String} string 
 * @return {Object} 
 */

function parseAttrString(string) {
  
  var tag = '';
  var id = '';
  var other = '';
  var className = '';
  
  var classes = [];
  
  var foundId = 0;
  var reading = false;
  
  var charLength = string.length;
  
  for (var i = 0, t; t = string[i], i < charLength; i++) {
    
    var idenToken = isIdentityToken(t);
    
    if (idenToken && reading !== '[') {
      reading = t;
    }
    
    switch (reading) {
      case '.':
        if (idenToken) {
          classes.push(className);
          className = '';
        }
        else {
          className += t;
        }
        break;
      case '#':
        if (idenToken) {
          foundId++;
        }
        else if (foundId <= 1) {
          id += t;
        }
        break;
      case '[':
        if (t === ']') {
          reading = false;
        }
        else if (t !== '[') {
          other += t;
        }
        break;
      case false:
        tag += t;
        break;
    }
  }
  
  if (className) {
    classes.push(className);
  }
  
  return {
    tag: tag,
    id: id,
    classes: classes,
    other: other
  };
  
}

/**
 * @param {Object} helpers 
 * @return {Object} An object with tag and attributes keys
 */

function createHTMLAttrString(helpers) {
  
  var tag = _.cleanSelector(helpers.tag);
  var id = _.cleanSelector(helpers.id);
  var attrs = helpers.other;
  
  var classes = _.uniq(helpers.classes)
    .map(_.cleanSelector)
    .join(' ');
  
  var spacer1 = id ? ' ' : '';
  var spacer2 = classes ? ' ' : '';
  
  var attributes = '' 
    + (id ? 'id="' + id + '"' : '') 
    + (classes ? spacer1 + 'class="' + classes + '"' : '') 
    + (attrs ? spacer2 + attrs : '');
  
  return {
    tag: tag || 'div',
    attributes: attributes
  };
}

/**
 * @param {String} string
 * @return {Object} 
 */

function parse(string) {
  return createHTMLAttrString(parseAttrString(string));
}

module.exports = parse;