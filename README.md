
## Flujo de trabajo con Git

El proyecto se desarrollará con la siguiente organización de ramas:

- `main`: versión estable
- `develop`: rama de integración
- `feature/*`: nuevas funcionalidades
- `fix/*`: correcciones
- `docs/*`: documentación

# TaskFlow

Aplicación web desarrollada para la actividad de **Entornos de Desarrollo**, compuesta por un **backend API REST** y un **frontend en HTML, CSS y JavaScript**, utilizando **SQLite** como base de datos.

El proyecto permite gestionar dos entidades principales:

- **categorías**
- **tareas**

Cada tarea pertenece a una categoría, por lo que existe una relación directa entre ambas entidades.

---

## 1. Descripción del proyecto

TaskFlow es una aplicación sencilla de gestión de tareas pensada para organizar información de forma clara y estructurada. Su objetivo es permitir al usuario crear, consultar, modificar y eliminar tanto categorías como tareas, utilizando una arquitectura separada entre backend y frontend.

La aplicación se ha desarrollado siguiendo una metodología basada en ramas de Git y Pull Requests, de forma que cada funcionalidad o corrección importante se ha trabajado de manera independiente antes de integrarse en la rama principal de desarrollo.

---

## 2. Tecnologías utilizadas

### Backend
- Node.js
- Express
- SQLite
- express-validator
- CORS

### Frontend
- HTML5
- CSS3
- JavaScript

### Herramientas de desarrollo
- Git
- GitHub
- Visual Studio Code
- Postman

---

## 3. Funcionalidades principales

La aplicación permite:

- gestionar categorías
- gestionar tareas
- relacionar tareas con categorías
- validar datos en backend
- validar formularios en frontend
- proteger el acceso mediante login
- impedir el borrado de una categoría si tiene tareas asociadas
- filtrar tareas por categoría

---

## 4. Estructura del proyecto

taskflow-entornos/
    backend/
        app.js
        package.json
        package-lock.json
        controller/
        database/
        middleware/
        models/
        routes/
        validators/
    frontend/
        index.html
        login.html
        css/
            styles.css
        js/
            app.js
            auth.js
            login.js
    docs/
        wiki-api.md
        postman/
    .gitignore
    README.md


## 5. Modelo de datos

La aplicación trabaja con dos entidades principales:

### Categorías
Cada categoría sirve para clasificar tareas.

Campos principales:
- `id`
- `name`
- `description`

### Tareas
Cada tarea pertenece a una categoría.

Campos principales:
- `id`
- `title`
- `description`
- `status`
- `due_date`
- `category_id`

### Relación entre entidades
- una categoría puede tener varias tareas
- una tarea pertenece a una sola categoría

Además, no se permite eliminar una categoría si tiene tareas asociadas, para mantener la integridad de los datos.

---

## 6. Instalación del backend

### 6.1. Requisitos previos
Es necesario tener instalado:
- Node.js
- npm

### 6.2. Instalación
Situarse en la carpeta `backend`:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

### 6.3. Arranque del backend
Una vez instaladas las dependencias:

```bash
npm start
```

Si todo está correcto, el servidor se ejecutará en:

```text
http://localhost:3000
```

---

## 7. Instalación del frontend

El frontend está desarrollado con HTML, CSS y JavaScript, por lo que no necesita instalación de dependencias.

Basta con abrir los archivos del directorio `frontend`.

La aplicación utiliza principalmente:

- `login.html` para el acceso
- `index.html` como panel principal protegido

---

## 8. Cómo arrancar la aplicación

### Paso 1. Iniciar el backend
Desde la carpeta `backend`:

```bash
npm start
```

### Paso 2. Abrir el frontend
Abrir en el navegador el archivo:

```text
frontend/login.html
```

### Paso 3. Acceder con las credenciales de prueba
Credenciales utilizadas en esta versión:

- **Usuario:** `admin`
- **Contraseña:** `1234`

Una vez autenticado, el usuario accede al panel principal de la aplicación.

---

## 9. Funcionamiento general

### Gestión de categorías
Desde la interfaz se pueden:
- crear categorías
- listar categorías
- editar categorías
- eliminar categorías

### Gestión de tareas
Desde la interfaz se pueden:
- crear tareas
- listar tareas
- editar tareas
- eliminar tareas

### Relación entre tareas y categorías
Al crear o editar una tarea es obligatorio seleccionar una categoría.  
Además, en el listado de tareas se muestra la categoría asociada y existe un filtro para mostrar únicamente las tareas de una categoría concreta.

---

## 10. Endpoints principales del backend

### Categorías
- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Tareas
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

## 11. Validaciones implementadas

### Validación en backend
Se han validado los datos antes de almacenarlos en base de datos, entre otros:

#### Categorías
- nombre obligatorio
- longitud mínima del nombre

#### Tareas
- título obligatorio
- longitud mínima del título
- estado permitido
- fecha con formato correcto
- categoría obligatoria
- categoría existente

### Validación en frontend
También se incorporó validación en formularios para:
- evitar envíos vacíos
- mostrar mensajes visibles al usuario
- marcar en rojo los campos incorrectos
- limpiar errores visuales al editar o corregir

---

## 12. Login y protección del frontend

La aplicación cuenta con una pantalla de acceso simple para proteger la interfaz principal.

Características:
- formulario de login
- validación de usuario y contraseña
- almacenamiento de sesión en `localStorage`
- redirección al login si no hay sesión activa
- opción de cerrar sesión

Esto permite evitar el acceso directo a la pantalla principal si el usuario no se ha autenticado previamente.

---

## 13. Documentación adicional

El proyecto incluye documentación complementaria:

- `docs/wiki-api.md` con la explicación de la API
- colección Postman con ejemplos de uso del backend
- organización del desarrollo mediante ramas y Pull Requests

---

## 14. Funcionalidades obligatorias cubiertas

En el proyecto se han implementado los siguientes requisitos obligatorios:

- backend con CRUD completo para dos entidades
- frontend con CRUD completo para dos entidades
- uso de base de datos SQLite
- repositorio en GitHub
- README con información del proyecto e instrucciones de puesta en marcha
- desarrollo por ramas y Pull Requests

---

## 15. Funcionalidades voluntarias implementadas

Además de los requisitos obligatorios, se han incorporado varias mejoras:

- relación entre los elementos del modelo de datos
- validación en backend con `express-validator`
- validación en frontend con JavaScript
- login para proteger el acceso a la aplicación
- documentación de la API
- colección Postman
- control de integridad referencial al eliminar categorías

---



