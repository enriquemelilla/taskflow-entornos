const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "taskflow.db");

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Error al conectar con SQLite:", error.message);
  } else {
    console.log("Conexión a SQLite establecida correctamente");

    db.run("PRAGMA foreign_keys = ON", (pragmaError) => {
      if (pragmaError) {
        console.error("No se pudieron activar las claves foráneas:", pragmaError.message);
      } else {
        console.log("Claves foráneas activadas en SQLite");
      }
    });
  }
});

module.exports = db;