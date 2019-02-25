const BaseRepository = require('./base_repository');

class PlaceRepo extends BaseRepository {
    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Place.findOne(conditions);
    }

    async findAll(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Place.find(conditions);
    }

    async create(payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Place.create(payload);
    }

    async updateOne(conditions, payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Place.updateOne(conditions, payload);
    }
}

module.exports = PlaceRepo;
