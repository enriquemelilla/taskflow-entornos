const db = require("../database/connection");

function getAllCategories(callback) {
  db.all("SELECT * FROM categories", [], callback);
}

module.exports = {
  getAllCategories
};