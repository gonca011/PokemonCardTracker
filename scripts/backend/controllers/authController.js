const userService = require("../services/userService");

async function register(req, res) {
  const user = await userService.registerUser(req.body);

  res.status(201).json(user);
}

async function login(req, res) {
  const user = await userService.loginUser(req.body);

  res.json(user);
}

async function googleLogin(req, res) {
  const user = await userService.loginGoogleUser(req.body);

  res.json(user);
}

module.exports = {
  googleLogin,
  login,
  register,
};
