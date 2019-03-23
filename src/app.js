const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { MapsContext, MongoContext, HttpError } = require('./common');

const ApiGuard = require('./middlewares/request-handler/api_guard');
const RateLimiter = require('./utils/libs/rate_limiter');
const GoogleAuth = require('./utils/libs/gauth');
const GoogleMaps = require('./utils/libs/gmaps');

const routeHandler = require('./routes');
const exceptionHandler = require('./exceptions');

const app = express();

/** Singleton Instances */
MongoContext.initialize();
HttpError.initialize();
/** */

/** Plugins */
GoogleAuth.initialize();
GoogleMaps.initialize();
/** */

/** Thrid Party Plugins */
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/** */

/** Global Middlewares */
app.use(ApiGuard);
app.use(RateLimiter());
/** */

/** App Handlers */
routeHandler(app);
exceptionHandler(app);
/** */

module.exports = app;
