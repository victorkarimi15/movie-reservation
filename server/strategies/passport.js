const passport = require('passport');

require('./localStrategy.js')(passport);
require('./oauthStrategy.js')(passport);

module.exports = passport;  