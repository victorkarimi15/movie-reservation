const passport = require('passport');

require('./local-strategy.js')(passport);
require('./oauth-strategy.js')(passport);

module.exports = passport;  