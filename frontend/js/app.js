const CATEGORY_API_URL = "http://localhost:3000/api/categories";

const categoryForm = document.getElementById("category-form");
const categoryIdInput = document.getElementById("category-id");
const categoryNameInput = document.getElementById("category-name");
const categoryDescriptionInput = document.getElementById("category-description");
const categoriesList = document.getElementById("categories-list");
const categoryMessage = document.getElementById("category-message");
const cancelCategoryEditBtn = document.getElementById("cancel-category-edit");

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  resetCategoryForm();
});

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
    loadCategories();
  } catch (error) {
    showCategoryMessage(error.message, "error");
  }
});

cancelCategoryEditBtn.addEventListener("click", () => {
  resetCategoryForm();
  showCategoryMessage("Edición cancelada", "success");
});

async function loadCategories() {
  try {
    const response = await fetch(CATEGORY_API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("No se pudieron cargar las categorías");
    }

    categoriesList.innerHTML = "";

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
    loadCategories();
  } catch (error) {
    showCategoryMessage(error.message, "error");
  }
}

function resetCategoryForm() {
  categoryForm.reset();
  categoryIdInput.value = "";
  cancelCategoryEditBtn.style.display = "none";
}

function showCategoryMessage(message, type) {
  categoryMessage.textContent = message;
  categoryMessage.className = "message";
  categoryMessage.classList.add(type);
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