const BaseRepository = require('./base_repository');

class UserRepo extends BaseRepository {
    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.User.findOne(conditions);
    }

    async create(payload) {
        const mongo = await this.getMongoInstance();
        return mongo.User.create(payload);
    }

    async updateOne(conditions, payload) {
        const mongo = await this.getMongoInstance();
        return mongo.User.updateOne(conditions, payload);
    }
}

module.exports = UserRepo;
