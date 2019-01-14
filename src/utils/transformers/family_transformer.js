exports.create = (request, family) => ({
    user_id: request.auth.uid,
    family: {
        id: family.uuid,
        role: request.body.role || null,
        nick: request.body.nick || family.fullname
    },
    pair: {
        id: 'test',
        status: 10
    }
});

exports.familyRequest = (request, person) => ({
    requestor_id: request.auth.uid,
    target_id: person.uuid,
    pair_code: [...Array(4)].map(item => Math.floor(Math.random() * Math.floor(10))).join``,
    status: 10
});

exports.familyList = families => families.map(person => ({
    uuid: person.uuid,
    fullname: person.family.fullname,
    nick: person.nick,
    role: person.role,
    condition: {
        status: person.condition && person.condition.status,
        location: person.condition && person.condition.geograph.coordinates.join(',')
    }
}));

exports.requestList = requests => requests.map(request => ({
    uuid: request.uuid,
    fullname: request.requestor.fullname,
    pair_code: request.pair_code
}));

module.exports = exports;
