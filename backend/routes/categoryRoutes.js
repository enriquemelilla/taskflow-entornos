const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { categoryValidationRules } = require("../validators/categoryValidator");
const validationResultHandler = require("../middleware/validationResultHandler");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
// validacion de datos post y put
router.post(
  "/",
  categoryValidationRules,
  validationResultHandler,
  categoryController.createCategory
);
router.put(
  "/:id",
  categoryValidationRules,
  validationResultHandler,
  categoryController.updateCategory
);


router.delete("/:id", categoryController.deleteCategory);

module.exports = router;