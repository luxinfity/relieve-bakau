'use strict';

const {
    HttpError, MongoContext, JobWorker, Maps, Firebase
} = require('relieve-common');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

/** Handlers */
const RateLimiter = require('./utils/libs/rate_limiter');
const RouteHandler = require('./routes');
const ExceptionHandler = require('./exceptions');

/** Configuration file */
const { mongodb: MongoConfig } = require('./config/database');
const { maps: MapsConfig, firebase: FirebaseConfig } = require('./config/plugins');
const { MODELS_PATH } = require('./utils/constant');

/** Initialize Express */
const app = express();

/** Singleton Instances */
HttpError.initialize();
MongoContext.initialize({ path: MODELS_PATH.MONGO, config: MongoConfig });
JobWorker.initialize({ path: MODELS_PATH.JOB });
Firebase.initialize(FirebaseConfig);
Maps.initialize(MapsConfig);

/** Thrid Party Plugins */
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** Global Middlewares */
app.use(RateLimiter());

/** App Handlers */
RouteHandler(app);
ExceptionHandler(app);

module.exports = app;
