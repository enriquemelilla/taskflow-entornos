const db = require("./connection");

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )
    `, (error) => {
      if (error) {
        console.error("Error al crear la tabla categories:", error.message);
      } else {
        console.log("Tabla categories verificada o creada correctamente");
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pendiente',
        due_date TEXT,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `, (error) => {
      if (error) {
        console.error("Error al crear la tabla tasks:", error.message);
      } else {
        console.log("Tabla tasks verificada o creada correctamente");
      }
    });
  });
}

module.exports = initDatabase;