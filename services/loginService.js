const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { loginSchema } = require("../controllers/ValidationController");
const Admin = require("../models/admin");
const Role = require("../config/role");
const Organizer = require("../models/organizer");
const messages = {
  usernameNotExist: "Username is not found. Invalid login credentials.",
  wrongRole: "Please make sure this is your identity.",
  loginSuccess: "You are successfully logged in.",
  wrongPassword: "Incorrect password.",
  loginError: "Oops! Something went wrong.",
};

const login = async (data, role, res) => {
  try {
    const schema = await loginSchema.validateAsync(data);
    const { email, password } = data;
    let foundUser;
    if (role === Role.organzier) {
      foundUser = await Organizer.findOne({ email: email });
    } else {
      foundUser = await Admin.findOne({ email: email });
    }

    if (!foundUser) {
      return res.status(404).json({
        reason: "User not found",
        message: messages.usernameNotExist,
        success: false,
      });
    }

    if (foundUser.role !== role) {
      return res.status(403).json({
        reason: "role",
        message: messages.wrongRole,
        success: false,
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const role = Object.values(foundUser.role);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            role: role,
          },
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30s",
        }
      );
      const refreshToken = jwt.sign({ email: foundUser.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "None", secure: true });

      const result = {
        role: foundUser.role,
        email: foundUser.email,
        accessToken: `Bearer ${accessToken}`,
        refreshToken: refreshToken,
        expiresIn: "30s",
      };
      return res.status(200).json({
        ...result,
        message: messages.loginSuccess,
        success: true,
      });
    } else {
      return res.status(403).json({
        reason: "password",
        message: messages.wrongPassword,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    let errorMsg = messages.loginError;
    if (error.isJoi === true) {
      error.status = 403;
      errorMsg = error.message;
    }
    return res.status(500).json({
      reason: "server",
      message: errorMsg,
      success: false,
    });
  }
};

module.exports = { login };
