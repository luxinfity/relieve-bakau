exports.familyRequest = (context, person) => ({
    requestor_id: context.id,
    target_id: person.id,
    pair_code: [...Array(4)].map(item => Math.floor(Math.random() * Math.floor(10))).join``,
    status: 10
});

exports.familyList = families => families.map((person) => {
    let condition = null;
    if (person.condition) {
        const [lng, lat] = person.condition.geograph.coordinates;
        condition = {
            status: person.condition.status,
            location: `${lat}, ${lng}`
        };
    }
    return ({
        id: person.id,
        fullname: person.family.fullname,
        nick: person.nick,
        role: person.role,
        condition
    });
});

exports.requestList = requests => requests.map(request => ({
    id: request.id,
    fullname: request.requestor.fullname,
    pair_code: request.pair_code
}));

module.exports = exports;
