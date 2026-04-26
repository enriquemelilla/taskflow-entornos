const db = require("../database/connection");

function getAllTasks(callback) {
  db.all("SELECT * FROM tasks", [], callback);
}

module.exports = {
  getAllTasks
};