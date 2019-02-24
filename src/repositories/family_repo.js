const BaseRepository = require('./base_repository');

class FamilyRepo extends BaseRepository {
    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Family.findOne(conditions);
    }

    async findAll(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Family.find(conditions);
    }

    async create(payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Family.create(payload);
    }

    async updateOne(conditions, payload, options = {}) {
        const mongo = await this.getMongoInstance();
        return mongo.Family.updateOne(conditions, payload, options);
    }

    async updateMany(conditions, payload) {
        const mongo = await this.getMongoInstance();
        return mongo.Family.updateMany(conditions, payload);
    }

    async detailedList(userId) {
        const mongo = await this.getMongoInstance();
        return mongo.Family.find({ user_id: userId })
            .populate('family', 'fullname')
            .populate('condition');
    }

    async requestList(userId, status) {
        const mongo = await this.getMongoInstance();
        return mongo.FamilyRequest.find({
            target_id: userId, status
        })
            .populate('requestor', 'fullname');
    }

    async requestDetail(requestorId, targetId, pairCode, status) {
        const mongo = await this.getMongoInstance();
        return mongo.FamilyRequest.findOne({
            requestor_id: requestorId, target_id: targetId, pair_code: pairCode, status
        });
    }

    async updateRequest(conditions, payload, options = {}) {
        const mongo = await this.getMongoInstance();
        return mongo.FamilyRequest.updateOne(conditions, payload, options);
    }
}

module.exports = FamilyRepo;
