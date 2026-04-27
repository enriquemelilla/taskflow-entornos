const CATEGORY_API_URL = "http://localhost:3000/api/categories";
const TASK_API_URL = "http://localhost:3000/api/tasks";

/* -------------------- CATEGORÍAS -------------------- */

const categoryForm = document.getElementById("category-form");
const categoryIdInput = document.getElementById("category-id");
const categoryNameInput = document.getElementById("category-name");
const categoryDescriptionInput = document.getElementById("category-description");
const categoriesList = document.getElementById("categories-list");
const categoryMessage = document.getElementById("category-message");
const cancelCategoryEditBtn = document.getElementById("cancel-category-edit");

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

document.addEventListener("DOMContentLoaded", async () => {
  resetCategoryForm();
  resetTaskForm();
  await loadCategories();
  await loadTasks();
});

/* -------------------- EVENTOS CATEGORÍAS -------------------- */

categoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = categoryIdInput.value;
  const payload = {
    name: categoryNameInput.value.trim(),
    description: categoryDescriptionInput.value.trim()
  };

  if (!payload.name) {
    showCategoryMessage("El nombre de la categoría es obligatorio", "error");
    return;
  }

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

  if (!payload.title) {
    showTaskMessage("El título es obligatorio", "error");
    return;
  }

  if (!payload.category_id) {
    showTaskMessage("Debes seleccionar una categoría", "error");
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
}

/* -------------------- FUNCIONES TAREAS -------------------- */

async function loadTasks() {
  try {
    const response = await fetch(TASK_API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("No se pudieron cargar las tareas");
    }

    tasksList.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tasksList.innerHTML = `
        <tr>
          <td colspan="7">No hay tareas registradas.</td>
        </tr>
      `;
      return;
    }

    data.forEach((task) => {
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
}

/* -------------------- MENSAJES -------------------- */

function showCategoryMessage(message, type) {
  categoryMessage.textContent = message;
  categoryMessage.className = "message";
  categoryMessage.classList.add(type);
}

function showTaskMessage(message, type) {
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