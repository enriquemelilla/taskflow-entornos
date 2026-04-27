const categoryModel = require("../models/categoryModel");
const taskModel = require("../models/taskModel");
function getAllCategories(req, res) {
  categoryModel.getAllCategories((error, rows) => {
    if (error) {
      return res.status(500).json({
        error: "Error al obtener las categorías"
      });
    }

    res.json(rows);
  });
}

function getCategoryById(req, res) {
  const { id } = req.params;

  categoryModel.getCategoryById(id, (error, row) => {
    if (error) {
      return res.status(500).json({
        error: "Error al obtener la categoría"
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "Categoría no encontrada"
      });
    }

    res.json(row);
  });
}

function createCategory(req, res) {
  const { name, description } = req.body;

 /*  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "El nombre de la categoría es obligatorio"
    }); 
  }*/

  categoryModel.createCategory(name.trim(), description || null, (error, result) => {
    if (error) {
      return res.status(500).json({
        error: "Error al crear la categoría"
      });
    }

    res.status(201).json({
      message: "Categoría creada correctamente",
      category: result
    });
  });
}

function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "El nombre de la categoría es obligatorio"
    });
  }

  categoryModel.updateCategory(id, name.trim(), description || null, (error, result) => {
    if (error) {
      return res.status(500).json({
        error: "Error al actualizar la categoría"
      });
    }

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Categoría no encontrada"
      });
    }

    res.json({
      message: "Categoría actualizada correctamente"
    });
  });
}

function deleteCategory(req, res) {
  const { id } = req.params;

  taskModel.countTasksByCategory(id, (countError, countResult) => {
    if (countError) {
      return res.status(500).json({
        error: "Error al comprobar si la categoría tiene tareas asociadas"
      });
    }

    if (countResult.total > 0) {
      return res.status(400).json({
        error: "No se puede eliminar la categoría porque tiene tareas asociadas"
      });
    }

    categoryModel.deleteCategory(id, (error, result) => {
      if (error) {
        return res.status(500).json({
          error: "Error al eliminar la categoría"
        });
      }

      if (result.changes === 0) {
        return res.status(404).json({
          error: "Categoría no encontrada"
        });
      }

      res.json({
        message: "Categoría eliminada correctamente"
      });
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