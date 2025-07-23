const User = require('../../models/user/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
   const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser || email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const { password: _, ...userData } = newUser._doc;
    res.status(201).json({ message: "User created successfully", user: userData });

  } catch (error) {
    console.error('Error in creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    console.log("🔐 Login attempt:", email, password);
    console.log("📦 Loaded ADMIN_EMAIL:", ADMIN_EMAIL);
    console.log("📦 Loaded ADMIN_PASSWORD:", ADMIN_PASSWORD);

    if (email.toLowerCase() === ADMIN_EMAIL?.toLowerCase()) {
      if (password !== ADMIN_PASSWORD) {
        console.log("❌ Admin password does not match");
        return res.status(401).json({ message: "Invalid email or password" });
      }

      console.log("✅ Admin login success");

      const token = jwt.sign(
        { role: 'admin', email: ADMIN_EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful (Admin)",
        token,
        user: {
          name: "Admin",
          email: ADMIN_EMAIL,
          role: "admin",
        }
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error('Error during user login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

// ✅ Added: Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    // If the request is from an admin (based on email)
    if (req.user?.email === process.env.ADMIN_EMAIL) {
      return res.status(200).json({
        user: {
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    // For normal users
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createUser,
  login,
  logout,
  getUserProfile, 
};
