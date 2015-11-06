var hlib = require('./hlib/hlib');

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

  var charLength = string.length;
  var foundId = 0;
  var reading = false;

  var className = '';
  var tag = '';
  var id = '';
  var classes = [];
  var other = '';

  for (var i = 0, t; t = string[i], i < charLength; i++) {

    var idenToken = isIdentityToken(t);

    if (idenToken && reading !== '[') {
      reading = t;
    }

    switch (reading) {
      case '.':
        if (!idenToken) {
          className += t;
        } else {
          classes.push(className);
          className = '';
        }
        break;
      case '#':
        if (!idenToken && foundId <= 1) {
          id += t;
        } else {
          foundId++;
        }
        break;
      case '[':
        if (t === ']') {
          reading = false;
        } else if (t !== '[') {
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

  var helpers = helpers || {};

  helpers.id = hlib.cleanCSSName(helpers.id);
  helpers.classes = hlib.uniq(helpers.classes)
    .map(function(el) {
      return hlib.cleanCSSName(el);
    })
    .join(' ');
    
  var attributes = '' 
    + ((helpers.id) ? 'id="' + helpers.id + '"' : '') 
    + ((helpers.classes) ? ' class="' + helpers.classes + '"' : '') 
    + ((helpers.other) ? ' ' + helpers.other : '');

  return {
    tag: helpers.tag ? helpers.tag : 'div',
    attributes: attributes
  }

}

var self = module.exports = {
  parseAttrString: function(string) {
    return createHTMLAttrString(parseAttrString(string));
  },
};
