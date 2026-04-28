const db = require("../database/connection");

function getAllCategories(callback) {
  const sql = "SELECT * FROM categories ORDER BY id DESC";
  db.all(sql, [], callback);
}

function getCategoryById(id, callback) {
  const sql = "SELECT * FROM categories WHERE id = ?";
  db.get(sql, [id], callback);
}

function createCategory(name, description, callback) {
  const sql = "INSERT INTO categories (name, description) VALUES (?, ?)";
  db.run(sql, [name, description], function (error) {
    callback(error, {
      id: this?.lastID,
      name,
      description
    });
  });
}

function updateCategory(id, name, description, callback) {
  const sql = "UPDATE categories SET name = ?, description = ? WHERE id = ?";
  db.run(sql, [name, description, id], function (error) {
    callback(error, {
      changes: this?.changes
    });
  });
}

function deleteCategory(id, callback) {
  const sql = "DELETE FROM categories WHERE id = ?";
  db.run(sql, [id], function (error) {
    callback(error, {
      changes: this?.changes
    });
  });
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};