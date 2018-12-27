// const { HttpResponse, exception } = require('../utils/helpers');
// const Position = require('../models/position_history_model');

// exports.latest = async (req, res, next) => {
//     try {
//         const latestPositions = await Position.getAllLatest();
//         return HttpResponse(res, 'latest position data retrieved', 200, latestPositions);
//     } catch (err) {
//         return next(exception('an error occured', 500, err.message));
//     }
// };

// module.exports = exports;
