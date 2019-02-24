const BaseRepository = require('./base_repository');

class EmergencyContactRepo extends BaseRepository {
    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.EmergencyContact.findOne(conditions);
    }

    async create(payload) {
        const mongo = await this.getMongoInstance();
        return mongo.EmergencyContact.create(payload);
    }

    async updateOne(conditions, payload) {
        const mongo = await this.getMongoInstance();
        return mongo.EmergencyContact.updateOne(conditions, payload);
    }
}

module.exports = EmergencyContactRepo;
