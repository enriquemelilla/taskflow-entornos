const { body } = require("express-validator");

const categoryValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre de la categoría debe tener al menos 2 caracteres"),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
];

module.exports = {
  categoryValidationRules
};