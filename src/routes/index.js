'use strict';

const UserRoutes = require('../routes/user_route');
const DiscoverRoutes = require('./discover_routes');
const AddressRoutes = require('../routes/address_route');
const FamilyRoutes = require('../routes/family_route');
const PositionRoutes = require('../routes/position_route');
const AuthRoutes = require('../routes/auth_route');
const AuthGuard = require('../middlewares/auth_guard');

module.exports = (app) => {
    app.use('/family', AuthGuard, FamilyRoutes);
    app.use('/user', AuthGuard, UserRoutes);
    app.use('/position', AuthGuard, PositionRoutes);
    app.use('/discover', AuthGuard, DiscoverRoutes);
    app.use('/address', AuthGuard, AddressRoutes);
    app.use('/auth', AuthRoutes);
};
