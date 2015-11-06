var hlib = require('./hlib/hlib');

module.exports = function(str, locals) {
  
  var str = String(str);
  var updated = {};
  
  for (var key in locals) {
    if (!locals.hasOwnProperty(key)) continue;
    updated['{{' + key + '}}'] = locals[key];
  }
  
  var re = new RegExp(hlib.keys(updated).join('|'), 'gi');
  
  return str.replace(re, function(matched) {
    return updated[matched];
  });
  
}