const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 6969;
app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports.app = app;
