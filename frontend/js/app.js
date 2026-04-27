const CATEGORY_API_URL = "http://localhost:3000/api/categories";
const TASK_API_URL = "http://localhost:3000/api/tasks";
const logoutBtn = document.getElementById("logout-btn");

/* -------------------- CATEGORÍAS -------------------- */

const categoryForm = document.getElementById("category-form");
const categoryIdInput = document.getElementById("category-id");
const categoryNameInput = document.getElementById("category-name");
const categoryDescriptionInput = document.getElementById("category-description");
const categoriesList = document.getElementById("categories-list");
const categoryMessage = document.getElementById("category-message");
const cancelCategoryEditBtn = document.getElementById("cancel-category-edit");
const categoryNameError = document.getElementById("category-name-error");
const categoryDescriptionError = document.getElementById("category-description-error");

/* -------------------- TAREAS -------------------- */

const taskForm = document.getElementById("task-form");
const taskIdInput = document.getElementById("task-id");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskStatusInput = document.getElementById("task-status");
const taskDueDateInput = document.getElementById("task-due-date");
const taskCategoryInput = document.getElementById("task-category");
const tasksList = document.getElementById("tasks-list");
const taskMessage = document.getElementById("task-message");
const cancelTaskEditBtn = document.getElementById("cancel-task-edit");
const taskCategoryFilter = document.getElementById("task-category-filter");
const clearTaskFilterBtn = document.getElementById("clear-task-filter");
const taskTitleError = document.getElementById("task-title-error");
const taskDescriptionError = document.getElementById("task-description-error");
const taskStatusError = document.getElementById("task-status-error");
const taskDueDateError = document.getElementById("task-due-date-error");
const taskCategoryError = document.getElementById("task-category-error");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("taskflowAuth");
    localStorage.removeItem("taskflowUser");
    window.location.href = "login.html";
  });
}


async function loadInitialData() {
  try {
    await Promise.allSettled([
      loadCategories(),
      loadTasks()
    ]);
  } catch (error) {
    console.error("Error en la carga inicial:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  resetCategoryForm();
  resetTaskForm();
  loadInitialData();
});

/* -------------------- EVENTOS CATEGORÍAS -------------------- */

categoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = categoryIdInput.value;
  const payload = {
    name: categoryNameInput.value.trim(),
    description: categoryDescriptionInput.value.trim()
  };
  if (!validateCategoryForm()) {
    showCategoryMessage("Revisa los campos del formulario de categorías", "error");
    return;
  }
  /* if (!payload.name) {
    showCategoryMessage("El nombre de la categoría es obligatorio", "error");
    return;
  } */

  try {
    let response;

    if (id) {
      response = await fetch(`${CATEGORY_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(CATEGORY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractErrorMessage(data));
    }

    showCategoryMessage(
      id ? "Categoría actualizada correctamente" : "Categoría creada correctamente",
      "success"
    );

    resetCategoryForm();
    await loadCategories();
    await loadTasks();
  } catch (error) {
    showCategoryMessage(error.message, "error");
  }
});

cancelCategoryEditBtn.addEventListener("click", () => {
  resetCategoryForm();
  showCategoryMessage("Edición de categoría cancelada", "success");
});

/* -------------------- EVENTOS TAREAS -------------------- */

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = taskIdInput.value;
  const payload = {
    title: taskTitleInput.value.trim(),
    description: taskDescriptionInput.value.trim(),
    status: taskStatusInput.value,
    due_date: taskDueDateInput.value || null,
    category_id: taskCategoryInput.value
  };

  /* if (!payload.title) {
    showTaskMessage("El título es obligatorio", "error");
    return;
  }

  if (!payload.category_id) {
    showTaskMessage("Debes seleccionar una categoría", "error");
    return;
  } */
  if (!validateTaskForm()) {
  showTaskMessage("Revisa los campos del formulario de tareas", "error");
  return;
}
  payload.category_id = Number(payload.category_id);

  try {
    let response;

    if (id) {
      response = await fetch(`${TASK_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(TASK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractErrorMessage(data));
    }

    showTaskMessage(
      id ? "Tarea actualizada correctamente" : "Tarea creada correctamente",
      "success"
    );

    resetTaskForm();
    await loadTasks();
  } catch (error) {
    showTaskMessage(error.message, "error");
  }
});

taskCategoryFilter.addEventListener("change", async () => {
  await loadTasks();
});

clearTaskFilterBtn.addEventListener("click", async () => {
  taskCategoryFilter.value = "";
  await loadTasks();
  showTaskMessage("Filtro de categoría eliminado", "success");
});


cancelTaskEditBtn.addEventListener("click", () => {
  resetTaskForm();
  showTaskMessage("Edición de tarea cancelada", "success");
});

/* -------------------- FUNCIONES CATEGORÍAS -------------------- */

async function loadCategories() {
  try {
    const response = await fetch(CATEGORY_API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("No se pudieron cargar las categorías");
    }

    categoriesList.innerHTML = "";
    taskCategoryInput.innerHTML = `<option value="">Selecciona una categoría</option>`;
    taskCategoryFilter.innerHTML = `<option value="">Todas las categorías</option>`;

    if (!Array.isArray(data) || data.length === 0) {
      categoriesList.innerHTML = `
        <tr>
          <td colspan="4">No hay categorías registradas.</td>
        </tr>
      `;
      return;
    }

    data.forEach((category) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${category.id}</td>
        <td>${escapeHtml(category.name)}</td>
        <td>${escapeHtml(category.description || "")}</td>
        <td>
          <button class="edit-btn" data-id="${category.id}">Editar</button>
          <button class="delete-btn" data-id="${category.id}">Eliminar</button>
        </td>
      `;

      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      taskCategoryInput.appendChild(option);

      const filterOption = document.createElement("option");
      filterOption.value = category.id;
      filterOption.textContent = category.name;
      taskCategoryFilter.appendChild(filterOption);

      const editBtn = row.querySelector(".edit-btn");
      const deleteBtn = row.querySelector(".delete-btn");

      editBtn.addEventListener("click", () => {
        startCategoryEdit(category);
      });

      deleteBtn.addEventListener("click", () => {
        deleteCategory(category.id);
      });

      categoriesList.appendChild(row);
    });
  } catch (error) {
    showCategoryMessage(error.message, "error");
  }
}

function startCategoryEdit(category) {
  clearCategoryValidation();
  showCategoryMessage("", "");

  categoryIdInput.value = category.id;
  categoryNameInput.value = category.name;
  categoryDescriptionInput.value = category.description || "";
  cancelCategoryEditBtn.style.display = "inline-block";
  showCategoryMessage("Editando categoría seleccionada", "success");
}

async function deleteCategory(id) {
  const confirmed = confirm("¿Seguro que quieres eliminar esta categoría?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${CATEGORY_API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractErrorMessage(data));
    }

    showCategoryMessage("Categoría eliminada correctamente", "success");
    resetCategoryForm();
    await loadCategories();
    await loadTasks();
  } catch (error) {
    showCategoryMessage(error.message, "error");
  }
}

function resetCategoryForm() {
  categoryForm.reset();
  categoryIdInput.value = "";
  cancelCategoryEditBtn.style.display = "none";
  clearCategoryValidation();
}

/* -------------------- FUNCIONES TAREAS -------------------- */

async function loadTasks() {
  try {
    const response = await fetch(TASK_API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("No se pudieron cargar las tareas");
    }

    const selectedCategoryId = taskCategoryFilter.value;

    let filteredTasks = data;

    if (selectedCategoryId) {
      filteredTasks = data.filter(
        (task) => String(task.category_id) === String(selectedCategoryId)
      );
    }

    tasksList.innerHTML = "";

    if (!Array.isArray(filteredTasks) || filteredTasks.length === 0) {
      tasksList.innerHTML = `
        <tr>
          <td colspan="7">No hay tareas para mostrar.</td>
        </tr>
      `;
      return;
    }

    filteredTasks.forEach((task) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${task.id}</td>
        <td>${escapeHtml(task.title)}</td>
        <td>${escapeHtml(task.description || "")}</td>
        <td>${escapeHtml(task.status || "")}</td>
        <td>${escapeHtml(task.due_date || "")}</td>
        <td>${escapeHtml(task.category_name || "")}</td>
        <td>
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        </td>
      `;

      const editBtn = row.querySelector(".edit-btn");
      const deleteBtn = row.querySelector(".delete-btn");

      editBtn.addEventListener("click", () => {
        startTaskEdit(task);
      });

      deleteBtn.addEventListener("click", () => {
        deleteTask(task.id);
      });

      tasksList.appendChild(row);
    });
  } catch (error) {
    showTaskMessage(error.message, "error");
  }
}

function startTaskEdit(task) {
  clearTaskValidation();
  showTaskMessage("", "");

  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description || "";
  taskStatusInput.value = task.status || "pendiente";
  taskDueDateInput.value = task.due_date || "";
  taskCategoryInput.value = String(task.category_id || "");
  cancelTaskEditBtn.style.display = "inline-block";
  showTaskMessage("Editando tarea seleccionada", "success");
}

async function deleteTask(id) {
  const confirmed = confirm("¿Seguro que quieres eliminar esta tarea?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${TASK_API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractErrorMessage(data));
    }

    showTaskMessage("Tarea eliminada correctamente", "success");
    resetTaskForm();
    await loadTasks();
  } catch (error) {
    showTaskMessage(error.message, "error");
  }
}

function resetTaskForm() {
  taskForm.reset();
  taskIdInput.value = "";
  taskStatusInput.value = "pendiente";
  taskCategoryInput.value = "";
  cancelTaskEditBtn.style.display = "none";
  clearTaskValidation();
}

/* -------------------- MENSAJES -------------------- */

function showCategoryMessage(message, type) {
  if (!message) {
    categoryMessage.textContent = "";
    categoryMessage.className = "message";
    return;
  }

  categoryMessage.textContent = message;
  categoryMessage.className = "message";
  categoryMessage.classList.add(type);
}

function showTaskMessage(message, type) {
  if (!message) {
    taskMessage.textContent = "";
    taskMessage.className = "message";
    return;
  }

  taskMessage.textContent = message;
  taskMessage.className = "message";
  taskMessage.classList.add(type);
}

function extractErrorMessage(data) {
  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((item) => item.message).join(" | ");
  }

  return data?.error || "Se ha producido un error inesperado";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function clearFieldError(inputElement, errorElement) {
  inputElement.classList.remove("input-error");
  errorElement.textContent = "";
}

function setFieldError(inputElement, errorElement, message) {
  inputElement.classList.add("input-error");
  errorElement.textContent = message;
}

function clearCategoryValidation() {
  clearFieldError(categoryNameInput, categoryNameError);
  clearFieldError(categoryDescriptionInput, categoryDescriptionError);
}

function clearTaskValidation() {
  clearFieldError(taskTitleInput, taskTitleError);
  clearFieldError(taskDescriptionInput, taskDescriptionError);
  clearFieldError(taskStatusInput, taskStatusError);
  clearFieldError(taskDueDateInput, taskDueDateError);
  clearFieldError(taskCategoryInput, taskCategoryError);
}

function validateCategoryForm() {
  clearCategoryValidation();
  let isValid = true;

  const name = categoryNameInput.value.trim();

  if (!name) {
    setFieldError(categoryNameInput, categoryNameError, "El nombre es obligatorio");
    isValid = false;
  } else if (name.length < 2) {
    setFieldError(categoryNameInput, categoryNameError, "El nombre debe tener al menos 2 caracteres");
    isValid = false;
  }

  return isValid;
}

function validateTaskForm() {
  clearTaskValidation();
  let isValid = true;

  const title = taskTitleInput.value.trim();
  const status = taskStatusInput.value;
  const dueDate = taskDueDateInput.value;
  const categoryId = taskCategoryInput.value;

  if (!title) {
    setFieldError(taskTitleInput, taskTitleError, "El título es obligatorio");
    isValid = false;
  } else if (title.length < 2) {
    setFieldError(taskTitleInput, taskTitleError, "El título debe tener al menos 2 caracteres");
    isValid = false;
  }

  const validStatus = ["pendiente", "en progreso", "completada"];
  if (!status) {
    setFieldError(taskStatusInput, taskStatusError, "El estado es obligatorio");
    isValid = false;
  } else if (!validStatus.includes(status)) {
    setFieldError(taskStatusInput, taskStatusError, "El estado seleccionado no es válido");
    isValid = false;
  }

  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    setFieldError(taskDueDateInput, taskDueDateError, "La fecha debe tener formato válido");
    isValid = false;
  }

  if (!categoryId) {
    setFieldError(taskCategoryInput, taskCategoryError, "Debes seleccionar una categoría");
    isValid = false;
  }

  return isValid;
}