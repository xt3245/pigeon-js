var hlib = require('./hlib/hlib'),
    parser = require('./pigeon-parser');
    

/**
 * Traverses a JS object, and parses into HTML.
 * @method build
 * @param {Object} obj 
 * @return {String}
 */
function build(obj) {

    var html = '',
        keys = hlib.keys(obj),
        keysLen = keys.length;

    for (var i = 0, key; key = keys[i], i < keysLen; i++) {

        var value = obj[key];
        
        if (key === '_') {
            html += '<!DOCTYPE ' + value + '>';
            continue;
        }
        
        if (hlib.isArray(value)) {

            var aLen = value.length,
                childrenString = '';

            for (var z = 0, item; item = value[z], z < aLen; z++) {

                if (hlib.isObj(item)) {
                    var itemKey = hlib.keys(item)[0];
                    // Duplicate keys issue
                    var itemValue = hlib.isObj(item[itemKey]) ? build(item[itemKey]) : item[itemKey];
                    childrenString += createNode(itemKey, itemValue);
                }
            }

            html += createNode(key, childrenString);
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
    }

    return html;

}

/**
 * Creates an HTML DOM node.
 * @param {String} attrString An attribute string, for example '.class#id'
 * @param {String} children Children of HTML DOM node.
 * @return {String} 
 */
function createNode(attrString, children) {
    var t = parser.parseAttrString(attrString),
        tag = t.tag,
        attrs = t.attributes;

    var spacer = attrs ? ' ' : '';
    return '<' + tag + spacer + attrs + '>' + children.toString() + '</' + tag + '>';
}

var self = module.exports = {
    build: build,
};

