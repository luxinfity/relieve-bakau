const JWT = require('../../utils/jwt');
const RefreshTokenRepo = require('../../repositories/refresh_token_repo');

exports.signUser = async (user, { withRefresh } = { withRefresh: true }) => {
    const token = await JWT.create({
        uid: user.uuid
    });
    const refresh = await JWT.generateRefreshToken();
    if (withRefresh) await RefreshTokenRepo.createOrUpdate({ user_id: user.uuid }, { user_id: user.uuid, token: refresh.token, expired_at: refresh.validity });
    return {
        token,
        refresh
    };
};

module.exports = exports;
