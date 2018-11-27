const bcrypt = require('bcryptjs');
const { apiResponse, exception } = require('../utils/helpers');
const UserRepo = require('../repositories/user_repo');

exports.profile = async (req, res, next) => {
    try {
        const user = await UserRepo.findOne({ _id: req.user.id });
        const response = {
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            phone: user.phone,
            birthdate: user.birthdate,
            isComplete: user.isComplete
        };
        return apiResponse(res, 'successfully retrieved profile data', 200, response);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.completeRegister = async (req, res, next) => {
    try {
        const user = await UserRepo.findOne({ _id: req.user.id, isComplete: false });
        if (!user) return next(exception('profile already completed', 403));

        const payload = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 8),
            isComplete: true
        };
        await UserRepo.update({ _id: req.user.id }, payload);

        return apiResponse(res, 'complete register successfull', 200);
    } catch (err) {
        return next(exception(err.message));
    }
};

module.exports = exports;
