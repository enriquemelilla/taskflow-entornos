const db = require("../database/connection");

function getAllTasks(callback) {
  const sql = `
    SELECT 
      tasks.id,
      tasks.title,
      tasks.description,
      tasks.status,
      tasks.due_date,
      tasks.category_id,
      categories.name AS category_name
    FROM tasks
    LEFT JOIN categories ON tasks.category_id = categories.id
    ORDER BY tasks.id DESC
  `;
  db.all(sql, [], callback);
}

function getTaskById(id, callback) {
  const sql = `
    SELECT 
      tasks.id,
      tasks.title,
      tasks.description,
      tasks.status,
      tasks.due_date,
      tasks.category_id,
      categories.name AS category_name
    FROM tasks
    LEFT JOIN categories ON tasks.category_id = categories.id
    WHERE tasks.id = ?
  `;
  db.get(sql, [id], callback);
}

function createTask(title, description, status, due_date, category_id, callback) {
  const sql = `
    INSERT INTO tasks (title, description, status, due_date, category_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, description, status, due_date, category_id], function (error) {
    callback(error, {
      id: this?.lastID,
      title,
      description,
      status,
      due_date,
      category_id
    });
  });
}

function updateTask(id, title, description, status, due_date, category_id, callback) {
  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?, due_date = ?, category_id = ?
    WHERE id = ?
  `;

  db.run(sql, [title, description, status, due_date, category_id, id], function (error) {
    callback(error, {
      changes: this?.changes
    });
  });
}

function deleteTask(id, callback) {
  const sql = "DELETE FROM tasks WHERE id = ?";

  db.run(sql, [id], function (error) {
    callback(error, {
      changes: this?.changes
    });
  });
}
function countTasksByCategory(categoryId, callback) {
  const sql = "SELECT COUNT(*) AS total FROM tasks WHERE category_id = ?";
  db.get(sql, [categoryId], callback);
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  countTasksByCategory
};