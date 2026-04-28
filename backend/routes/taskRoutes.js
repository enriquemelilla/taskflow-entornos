const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { taskValidationRules } = require("../validators/taskValidator");
const validationResultHandler = require("../middleware/validationResultHandler");
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
// validadion de datos post y put

router.post(
  "/",
  taskValidationRules,
  validationResultHandler,
  taskController.createTask
);

router.put(
  "/:id",
  taskValidationRules,
  validationResultHandler,
  taskController.updateTask
);

router.delete("/:id", taskController.deleteTask);

module.exports = router;