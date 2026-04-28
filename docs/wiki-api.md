# API TaskFlow

## 1. Introducción

La API de **TaskFlow** permite gestionar las dos entidades principales de la aplicación:

- **categorías**
- **tareas**

El backend se ha desarrollado con **Node.js** y **Express**, utilizando **SQLite** como base de datos. La API sigue una estructura REST sencilla y devuelve las respuestas en formato **JSON**.

Su finalidad es servir de soporte al frontend de la aplicación, permitiendo crear, consultar, modificar y eliminar categorías y tareas.

---

## 2. URL base

En entorno local, la API funciona sobre la siguiente dirección:

`http://localhost:3000`

A partir de esa URL base se construyen todos los endpoints.

---

## 3. Formato general de las respuestas

La API devuelve respuestas en formato JSON.

### Ejemplo de respuesta correcta

```json
{
  "message": "Operación realizada correctamente"
}
```

### Ejemplo de respuesta con datos

```json
{
  "id": 1,
  "name": "Personal",
  "description": "Tareas personales"
}
```

### Ejemplo de respuesta con error

```json
{
  "error": "Categoría no encontrada"
}
```

### Ejemplo de error de validación

```json
{
  "errors": [
    {
      "field": "name",
      "message": "El nombre de la categoría es obligatorio"
    }
  ]
}
```

---

## 4. Entidad categorías

La entidad **categorías** se utiliza para clasificar las tareas. Cada categoría puede estar asociada a varias tareas.

### Estructura de una categoría

```json
{
  "id": 1,
  "name": "Personal",
  "description": "Tareas personales"
}
```

---

## 5. Endpoints de categorías

### 5.1. Obtener todas las categorías

**Método:** `GET`  
**Ruta:** `/api/categories`

#### Descripción
Obtiene el listado completo de categorías registradas en la base de datos.

#### Ejemplo de petición

```http
GET /api/categories
```

#### Respuesta correcta

```json
[
  {
    "id": 1,
    "name": "Personal",
    "description": "Tareas personales"
  },
  {
    "id": 2,
    "name": "Trabajo",
    "description": "Tareas relacionadas con el trabajo"
  }
]
```

---

### 5.2. Obtener una categoría por ID

**Método:** `GET`  
**Ruta:** `/api/categories/:id`

#### Descripción
Obtiene una categoría concreta a partir de su identificador.

#### Parámetros de ruta

- `id`: identificador numérico de la categoría

#### Ejemplo de petición

```http
GET /api/categories/1
```

#### Respuesta correcta

```json
{
  "id": 1,
  "name": "Personal",
  "description": "Tareas personales"
}
```

#### Posible error

```json
{
  "error": "Categoría no encontrada"
}
```

---

### 5.3. Crear una categoría

**Método:** `POST`  
**Ruta:** `/api/categories`

#### Descripción
Crea una nueva categoría en la base de datos.

#### Body JSON de ejemplo

```json
{
  "name": "Estudios",
  "description": "Tareas relacionadas con formación y prácticas"
}
```

#### Respuesta correcta

```json
{
  "message": "Categoría creada correctamente",
  "category": {
    "id": 3,
    "name": "Estudios",
    "description": "Tareas relacionadas con formación y prácticas"
  }
}
```

#### Posibles errores de validación

```json
{
  "errors": [
    {
      "field": "name",
      "message": "El nombre de la categoría es obligatorio"
    }
  ]
}
```

```json
{
  "errors": [
    {
      "field": "name",
      "message": "El nombre de la categoría debe tener al menos 2 caracteres"
    }
  ]
}
```

---

### 5.4. Actualizar una categoría

**Método:** `PUT`  
**Ruta:** `/api/categories/:id`

#### Descripción
Modifica los datos de una categoría existente.

#### Parámetros de ruta

- `id`: identificador numérico de la categoría

#### Body JSON de ejemplo

```json
{
  "name": "Trabajo diario",
  "description": "Tareas del entorno profesional"
}
```

#### Respuesta correcta

```json
{
  "message": "Categoría actualizada correctamente"
}
```

#### Posible error si no existe

```json
{
  "error": "Categoría no encontrada"
}
```

#### Posible error de validación

```json
{
  "errors": [
    {
      "field": "name",
      "message": "El nombre de la categoría es obligatorio"
    }
  ]
}
```

---

### 5.5. Eliminar una categoría

**Método:** `DELETE`  
**Ruta:** `/api/categories/:id`

#### Descripción
Elimina una categoría existente, siempre que no tenga tareas asociadas.

#### Parámetros de ruta

- `id`: identificador numérico de la categoría

#### Ejemplo de petición

```http
DELETE /api/categories/3
```

#### Respuesta correcta

```json
{
  "message": "Categoría eliminada correctamente"
}
```

#### Posible error si no existe

```json
{
  "error": "Categoría no encontrada"
}
```

#### Posible error por integridad referencial

```json
{
  "error": "No se puede eliminar la categoría porque tiene tareas asociadas"
}
```

---

## 6. Entidad tareas

La entidad **tareas** representa las acciones o trabajos que se quieren gestionar dentro de la aplicación.

Cada tarea:
- tiene título
- puede tener descripción
- tiene un estado
- puede tener fecha límite
- pertenece a una categoría

### Estructura de una tarea

```json
{
  "id": 1,
  "title": "Preparar práctica",
  "description": "Revisar backend y frontend",
  "status": "pendiente",
  "due_date": "2026-05-10",
  "category_id": 1,
  "category_name": "Estudios"
}
```

---

## 7. Endpoints de tareas

### 7.1. Obtener todas las tareas

**Método:** `GET`  
**Ruta:** `/api/tasks`

#### Descripción
Obtiene el listado completo de tareas, incluyendo la categoría asociada.

#### Ejemplo de petición

```http
GET /api/tasks
```

#### Respuesta correcta

```json
[
  {
    "id": 1,
    "title": "Preparar práctica",
    "description": "Revisar backend y frontend",
    "status": "pendiente",
    "due_date": "2026-05-10",
    "category_id": 1,
    "category_name": "Estudios"
  },
  {
    "id": 2,
    "title": "Hacer la compra",
    "description": "Comprar productos básicos",
    "status": "completada",
    "due_date": "2026-05-02",
    "category_id": 2,
    "category_name": "Personal"
  }
]
```

---

### 7.2. Obtener una tarea por ID

**Método:** `GET`  
**Ruta:** `/api/tasks/:id`

#### Descripción
Obtiene una tarea concreta a partir de su identificador.

#### Parámetros de ruta

- `id`: identificador numérico de la tarea

#### Ejemplo de petición

```http
GET /api/tasks/1
```

#### Respuesta correcta

```json
{
  "id": 1,
  "title": "Preparar práctica",
  "description": "Revisar backend y frontend",
  "status": "pendiente",
  "due_date": "2026-05-10",
  "category_id": 1,
  "category_name": "Estudios"
}
```

#### Posible error

```json
{
  "error": "Tarea no encontrada"
}
```

---

### 7.3. Crear una tarea

**Método:** `POST`  
**Ruta:** `/api/tasks`

#### Descripción
Crea una nueva tarea y la vincula a una categoría existente.

#### Body JSON de ejemplo

```json
{
  "title": "Estudiar Express",
  "description": "Repasar middleware y rutas",
  "status": "pendiente",
  "due_date": "2026-05-15",
  "category_id": 1
}
```

#### Respuesta correcta

```json
{
  "message": "Tarea creada correctamente",
  "task": {
    "id": 3,
    "title": "Estudiar Express",
    "description": "Repasar middleware y rutas",
    "status": "pendiente",
    "due_date": "2026-05-15",
    "category_id": 1
  }
}
```

#### Posibles errores de validación

##### Título obligatorio

```json
{
  "errors": [
    {
      "field": "title",
      "message": "El título es obligatorio"
    }
  ]
}
```

##### Título demasiado corto

```json
{
  "errors": [
    {
      "field": "title",
      "message": "El título debe tener al menos 2 caracteres"
    }
  ]
}
```

##### Estado no válido

```json
{
  "errors": [
    {
      "field": "status",
      "message": "El estado debe ser pendiente, en progreso o completada"
    }
  ]
}
```

##### Fecha incorrecta

```json
{
  "errors": [
    {
      "field": "due_date",
      "message": "La fecha debe tener un formato válido, por ejemplo 2026-04-30"
    }
  ]
}
```

##### Categoría inexistente

```json
{
  "errors": [
    {
      "field": "category_id",
      "message": "La categoría indicada no existe"
    }
  ]
}
```

---

### 7.4. Actualizar una tarea

**Método:** `PUT`  
**Ruta:** `/api/tasks/:id`

#### Descripción
Modifica los datos de una tarea ya existente.

#### Parámetros de ruta

- `id`: identificador numérico de la tarea

#### Body JSON de ejemplo

```json
{
  "title": "Preparar práctica final",
  "description": "Revisar backend, frontend y documentación",
  "status": "en progreso",
  "due_date": "2026-05-20",
  "category_id": 1
}
```

#### Respuesta correcta

```json
{
  "message": "Tarea actualizada correctamente"
}
```

#### Posible error si no existe

```json
{
  "error": "Tarea no encontrada"
}
```

#### Posibles errores de validación

```json
{
  "errors": [
    {
      "field": "title",
      "message": "El título es obligatorio"
    }
  ]
}
```

```json
{
  "errors": [
    {
      "field": "category_id",
      "message": "La categoría indicada no existe"
    }
  ]
}
```

---

### 7.5. Eliminar una tarea

**Método:** `DELETE`  
**Ruta:** `/api/tasks/:id`

#### Descripción
Elimina una tarea existente.

#### Parámetros de ruta

- `id`: identificador numérico de la tarea

#### Ejemplo de petición

```http
DELETE /api/tasks/3
```

#### Respuesta correcta

```json
{
  "message": "Tarea eliminada correctamente"
}
```

#### Posible error

```json
{
  "error": "Tarea no encontrada"
}
```

---

## 8. Estados permitidos en tareas

El campo `status` solo admite uno de estos valores:

- `pendiente`
- `en progreso`
- `completada`

Cualquier otro valor será rechazado por la validación del backend.

---

## 9. Relación entre categorías y tareas

La relación entre ambas entidades es la siguiente:

- una **categoría** puede tener varias **tareas**
- cada **tarea** pertenece a una sola **categoría**

Esta relación se refleja en:
- la base de datos
- la lógica del backend
- la interfaz de usuario

Además, el sistema impide eliminar una categoría si todavía tiene tareas asociadas, con el fin de mantener la consistencia de los datos.

---

## 10. Códigos de estado más habituales

### 200 OK
La petición se ha procesado correctamente.

### 201 Created
El recurso se ha creado correctamente.

### 400 Bad Request
Los datos enviados no cumplen la validación.

### 404 Not Found
El recurso solicitado no existe.

### 500 Internal Server Error
Se ha producido un error interno del servidor o de la base de datos.

---

## 11. Ejemplos rápidos de uso

### Crear categoría

```http
POST /api/categories
Content-Type: application/json
```

```json
{
  "name": "Personal",
  "description": "Tareas personales"
}
```

### Crear tarea

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Preparar entrega",
  "description": "Revisar trabajo final",
  "status": "pendiente",
  "due_date": "2026-05-25",
  "category_id": 1
}
```

### Actualizar tarea

```http
PUT /api/tasks/1
Content-Type: application/json
```

```json
{
  "title": "Preparar entrega final",
  "description": "Revisar backend, frontend y wiki",
  "status": "en progreso",
  "due_date": "2026-05-28",
  "category_id": 1
}
```

---

## 12. Observaciones finales

- La API devuelve siempre información en formato JSON.
- Las validaciones del backend evitan guardar datos incompletos o incorrectos.
- La integridad entre categorías y tareas se controla tanto en la lógica del sistema como en la relación entre tablas.
- Esta API está pensada para ser consumida desde el frontend de TaskFlow y también para poder probarse desde herramientas como Postman.
