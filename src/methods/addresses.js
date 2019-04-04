'use strict';

const { HttpError } = require('relieve-common');

const Repository = require('../repositories');
const AddressAdapter = require('../utils/adapters/address');
const { list: addressList, detail } = require('../utils/transformers/address_transformer');

exports.create = async (data, context) => {
    try {
        await AddressAdapter.createNewAddress(data.body, context.id);
        return {
            message: 'address created'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.list = async (data, context) => {
    try {
        const Repo = new Repository();
        const addresses = await Repo.get('address').findAll({ user_id: context.id });

        return {
            message: 'addresses retrieved',
            data: addressList(addresses)
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.detail = async (data, context) => {
    try {
        const Repo = new Repository(context);

        const address = await Repo.get('address').findDetailed(data.params.id);
        if (!address) throw HttpError.NotFound('address not found');

        return {
            message: 'address detail retrieved',
            data: detail(address)
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
