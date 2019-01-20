'use strict';

const axios = require('axios');
const moment = require('moment-timezone');

const { HttpResponse } = require('../utils/helpers');
const Config = require('../models/config');

const ENDPOINTS = {
    raw: 'rawdata',
    recent: 'recentdata',
    daily: 'dailydata',
    monthly: 'mothlydata'
};

const getWeatherData = async (type) => {
    const { value: key } = await Config.findOne({ key: 'weather_session_id' });
    return axios.get(`http://45.126.132.55:4444/${ENDPOINTS[type]}?format=json`, {
        headers: {
            Cookie: `sessionid=${key}`
        }
    });
};

const F2C = deg => (5 / 9) * (deg - 32);

const transformer = datas => datas.map(item => ({
    id: item.ID,
    temperature: {
        celcius: +F2C(item.tempf).toFixed(2),
        fahrenheit: item.tempf
    },
    humidity: item.humidity,
    time: moment(item.time).tz('Asia/Jakarta').format('DD-MM-YYYY H:mm:ss')
}));

exports.list = async (req, res, next) => {
    try {
        const type = req.query.type;
        const { data: [data] } = await getWeatherData(req.query.type);
        return HttpResponse(res, 'weather data retrieved', type === 'raw' ? data : transformer(data));
    } catch (err) {
        return next(err);
    }
};

exports.reauth = async (req, res, next) => {
    try {
        return HttpResponse(res, 'weather endpoint re-authenticated');
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
