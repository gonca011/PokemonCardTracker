const userService = require("../services/userService");

async function getUser(req, res) {
  const user = await userService.getUser(req.params.id);

  res.json(user);
}

async function updateUser(req, res) {
  const user = await userService.updateUser(req.params.id, req.body);

  res.json(user);
}

async function getStats(req, res) {
  const stats = await userService.getUserStats(req.params.id);

  res.json(stats);
}

module.exports = {
  getStats,
  getUser,
  updateUser,
};
