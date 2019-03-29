'use strict';

const { HttpError } = require('relieve-common');

const Repository = require('../repositories');
const { create } = require('../utils/transformers/position_transformer');

exports.create = async (data, context) => {
    try {
        const Repo = new Repository();
        const payload = create(data, context);

        await Repo.get('position').updateMany({ user_id: context.id, is_latest: true }, { is_latest: false });
        await Repo.get('position').create(payload);

        return {
            message: 'position and status updated'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
