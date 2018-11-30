
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongodb = require('../../app/models/mongodb');
const User = require('../../app/models/mongodb/user');

(function () {
    mongodb.boot();
    User.create({
        fullname: 'archie',
        username: 'archisdi',
        email: 'archie.isdiningrat@gmail.com',
        password: bcrypt.hashSync('admin', 8),
        birthdate: '1995-12-12',
        phone: '081242480700',
        is_complete: true
    });
}());
