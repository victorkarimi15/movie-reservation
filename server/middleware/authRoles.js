const authRoles = (...allowedRoles) => {
    return (req,res,next) => {
        if(allowedRoles.includes(req.user[0].user_role)) {
            next();
        } else {
            return res.status(401).json({'message': 'Unauthorized access!'});
        }
    }
};

module.exports = authRoles;