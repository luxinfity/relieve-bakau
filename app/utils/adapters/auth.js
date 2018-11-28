const JWT = require('../../utils/jwt');
const RefreshTokenRepo = require('../../repositories/refresh_token_repo');

exports.signUser = async (user, { withRefresh } = { withRefresh: true }) => {
    const token = await JWT.create({
        uid: user.uuid
    });
    const refresh = await JWT.generateRefreshToken();
    if (withRefresh) await RefreshTokenRepo.createOrUpdate({ userId: user.uuid }, { userId: user.uuid, token: refresh.token, expiredAt: refresh.validity });
    return {
        token,
        refresh
    };
};

module.exports = exports;
