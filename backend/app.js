const express = require("express");
const cors = require("cors");
const initDatabase = require("./database/init");
const categoryRoutes = require("./routes/categoryRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = 3000;

initDatabase();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API TaskFlow funcionando correctamente"
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});