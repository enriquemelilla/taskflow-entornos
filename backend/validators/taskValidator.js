const { body } = require("express-validator");
const categoryModel = require("../models/categoryModel");

const taskValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El título debe tener al menos 2 caracteres"),

  body("description")
    .optional({ checkFalsy: true })
    .trim(),

  body("status")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["pendiente", "en progreso", "completada"])
    .withMessage("El estado debe ser pendiente, en progreso o completada"),

  body("due_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("La fecha debe tener un formato válido, por ejemplo 2026-04-30"),

  body("category_id")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .isInt({ min: 1 })
    .withMessage("La categoría debe ser un número entero válido")
    .bail()
    .custom((value) => {
      return new Promise((resolve, reject) => {
        categoryModel.getCategoryById(value, (error, category) => {
          if (error) {
            return reject(new Error("Error al comprobar la categoría"));
          }

          if (!category) {
            return reject(new Error("La categoría indicada no existe"));
          }

          resolve(true);
        });
      });
    })
];

module.exports = {
  taskValidationRules
};