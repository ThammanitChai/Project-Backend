const jwt = require('jsonwebtoken');
const User = require('../models/User');

// exports.protect = async (req, res, next) => {
//     console.log("Headers:", req.headers.authorization);
//     console.log("Cookies:", req.cookies);

//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];
//     } else if (req.cookies && req.cookies.token) {
//         token = req.cookies.token;
//     }

//     console.log("Token found:", token);

//     if (!token || token === 'null' || token === 'none') {
//         return res.status(401).json({
//             success: false,
//             message: 'Not authorized to access this route'
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();
//     } catch (err) {
//         return res.status(401).json({
//             success: false,
//             message: 'Not authorized to access this route'
//         });
//     }
// };

// exports.protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token || token === 'null') {
//         return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log(decoded);
//         req.user = await User.findById(decoded.id);
//         next();
//     } catch (err) {
//         console.log(err.stack);
//         return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
//     }
// };

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        const user = await User.findById(decoded.id);
        console.log("User from DB:", user);
        console.log("Decoded token:", decoded);
        console.log("Looking for user id:", decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log(err.stack);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    }
};