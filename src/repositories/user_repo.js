const BaseRepository = require('./base_repository');

class UserRepo extends BaseRepository {
    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.User.findOne(conditions);
    }
}

module.exports = UserRepo;
