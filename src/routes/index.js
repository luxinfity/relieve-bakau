const UserRoutes = require('../routes/user_route');
const EmergencyContactRoutes = require('../routes/emergency_contact_routes');
const AddressRoutes = require('../routes/address_route');
const FamilyRoutes = require('../routes/family_route');
const PositionRoutes = require('../routes/position_route');
const AuthRoutes = require('../routes/auth_route');
const JWTAuth = require('../middlewares/request-handler/jwt_auth');

module.exports = (app) => {
    app.use('/family', JWTAuth, FamilyRoutes);
    app.use('/user', JWTAuth, UserRoutes);
    app.use('/position', JWTAuth, PositionRoutes);
    app.use('/emergency-contact', JWTAuth, EmergencyContactRoutes);
    app.use('/address', JWTAuth, AddressRoutes);
    app.use('/auth', AuthRoutes);
};
