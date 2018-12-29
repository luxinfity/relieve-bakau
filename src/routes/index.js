const UserRoutes = require('../routes/user_route');
const FamilyRoutes = require('../routes/family_route');
const PositionRoutes = require('../routes/position_route');
const AuthRoutes = require('../routes/auth_route');
const JWTAuth = require('../middlewares/request-handler/jwt_auth');

module.exports = (app) => {
    app.use('/family', JWTAuth, FamilyRoutes);
    app.use('/user', JWTAuth, UserRoutes);
    app.use('/position', JWTAuth, PositionRoutes);
    app.use('/', AuthRoutes);
};
