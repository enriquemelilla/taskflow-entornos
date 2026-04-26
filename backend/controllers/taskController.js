const taskModel = require("../models/taskModel");
const categoryModel = require("../models/categoryModel");

function getAllTasks(req, res) {
  taskModel.getAllTasks((error, rows) => {
    if (error) {
      return res.status(500).json({
        error: "Error al obtener las tareas"
      });
    }

    res.json(rows);
  });
}

function getTaskById(req, res) {
  const { id } = req.params;

  taskModel.getTaskById(id, (error, row) => {
    if (error) {
      return res.status(500).json({
        error: "Error al obtener la tarea"
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "Tarea no encontrada"
      });
    }

    res.json(row);
  });
}

function createTask(req, res) {
  const { title, description, status, due_date, category_id } = req.body;

  /* if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "El título de la tarea es obligatorio"
    });
  } */

  const validStatus = ["pendiente", "en progreso", "completada"];
  const finalStatus = status || "pendiente";

  /* if (!validStatus.includes(finalStatus)) {
    return res.status(400).json({
      error: "El estado de la tarea no es válido"
    }); 
  } */ 

  /* if (category_id === undefined || category_id === null || category_id === "") {
    return res.status(400).json({
      error: "La categoría es obligatoria"
    });
  } */

  /* categoryModel.getCategoryById(category_id, (categoryError, category) => {
    if (categoryError) {
      return res.status(500).json({
        error: "Error al comprobar la categoría"
      });
    }
 */
    /* if (!category) {
      return res.status(404).json({
        error: "La categoría indicada no existe"
      });
    } */

    taskModel.createTask(
      title.trim(),
      description || null,
      finalStatus,
      due_date || null,
      category_id,
      (error, result) => {
        if (error) {
          return res.status(500).json({
            error: "Error al crear la tarea"
          });
        }

        res.status(201).json({
          message: "Tarea creada correctamente",
          task: result
        });
      }
    ); 
}

function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, status, due_date, category_id } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "El título de la tarea es obligatorio"
    });
  }

  const validStatus = ["pendiente", "en progreso", "completada"];

  if (!validStatus.includes(status)) {
    return res.status(400).json({
      error: "El estado de la tarea no es válido"
    });
  }

  if (category_id === undefined || category_id === null || category_id === "") {
    return res.status(400).json({
      error: "La categoría es obligatoria"
    });
  }

  categoryModel.getCategoryById(category_id, (categoryError, category) => {
    if (categoryError) {
      return res.status(500).json({
        error: "Error al comprobar la categoría"
      });
    }

    if (!category) {
      return res.status(404).json({
        error: "La categoría indicada no existe"
      });
    }

    taskModel.updateTask(
      id,
      title.trim(),
      description || null,
      status,
      due_date || null,
      category_id,
      (error, result) => {
        if (error) {
          return res.status(500).json({
            error: "Error al actualizar la tarea"
          });
        }

        if (result.changes === 0) {
          return res.status(404).json({
            error: "Tarea no encontrada"
          });
        }

        res.json({
          message: "Tarea actualizada correctamente"
        });
      }
    );
  });
}

function deleteTask(req, res) {
  const { id } = req.params;

  taskModel.deleteTask(id, (error, result) => {
    if (error) {
      return res.status(500).json({
        error: "Error al eliminar la tarea"
      });
    }

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Tarea no encontrada"
      });
    }

    res.json({
      message: "Tarea eliminada correctamente"
    });
  });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};