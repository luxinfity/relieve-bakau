'use strict';

const { HttpResponse } = require('../utils/helpers');

const Repository = require('../repositories');
const { create } = require('../utils/transformers/position_transformer');

exports.create = async (req, res, next) => {
    try {
        const Repo = new Repository();
        const payload = create(req);

        await Repo.get('position').updateMany({ user_id: req.auth.uid, is_latest: true }, { is_latest: false });
        await Repo.get('position').create(payload);

        return HttpResponse(res, 'position and status updated');
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
