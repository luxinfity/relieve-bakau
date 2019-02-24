const BaseRepository = require('./base_repository');

class PositionRepo extends BaseRepository {
    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Position.findOne(conditions);
    }

    async create(payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Position.create(payload);
    }

    async updateOne(conditions, payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Position.updateOne(conditions, payload);
    }
}

module.exports = PositionRepo;
