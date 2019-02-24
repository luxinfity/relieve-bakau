const BaseRepository = require('./base_repository');

class AddressRepo extends BaseRepository {
    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Address.findOne(conditions);
    }

    async findAll(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Address.find(conditions);
    }

    async create(payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Address.create(payload);
    }

    async updateOne(conditions, payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Address.updateOne(conditions, payload);
    }

    async findDetailed(uuid, userId) {
        const mongo = await this.getMongoInstance();
        return mongo.Address.findOne({ uuid, user_id: userId })
            .populate('emergency_contacts');
    }
}

module.exports = AddressRepo;
