const User = require('../models/User');

// =======================
// REGISTER
// =======================
exports.register = async (req, res, next) => {
  try {
    const { name, tel, email, password, role } = req.body;

    // เช็ค email ซ้ำ
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists"
      });
    }

    const user = await User.create({
      name,
      tel,
      email,
      password,
      role
    });

    // 🔥 ส่ง token กลับเลย
    sendTokenResponse(user, 201, res);

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


// =======================
// LOGIN
// =======================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // เช็ค input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password"
      });
    }

    // หา user + ดึง password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // เช็ค password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // 🔥 ส่ง token
    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


// =======================
// SEND TOKEN FUNCTION
// =======================
const sendTokenResponse = (user, statusCode, res) => {

  // 🔐 สร้าง JWT
  const token = user.getSignedJwtToken();

  // cookie options
  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 วัน
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      role: user.role
    });
};


// =======================
// GET CURRENT USER
// =======================
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};


// =======================
// LOGOUT
// =======================
exports.logout = async (req, res, next) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true
  });

  res.status(200).json({
    success: true
  });
};