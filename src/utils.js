const sanitizeHtml = require('sanitize-html');

function sanitizeString(str) {
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

module.exports = {
  sanitizeString,
};
