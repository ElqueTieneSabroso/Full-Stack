# Task Manager - Node.js + MySQL

Una aplicación CRUD completa para gestión de tareas con Node.js, Express y MySQL.

## 🚀 Características

- ✅ Crear, leer, actualizar y eliminar tareas
- 🎯 Niveles de prioridad (Low, Medium, High)
- 💾 Persistencia de datos con MySQL
- 🔄 API RESTful
- 📱 Interfaz responsive con Bootstrap

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL Server (v5.7 o superior)
- npm o yarn

## ⚙️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar la base de datos:**
   - Ejecuta el archivo `database.sql` en tu servidor MySQL:
```bash
mysql -u root -p < database.sql
```

3. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```
   - Edita `.env` con tus credenciales de MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=task_manager
PORT=3000
```

## 🏃 Ejecución

**Iniciar solo el servidor API:**
```bash
npm start
```

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

El servidor API se ejecuta en `http://localhost:3000`

**Nota:** El frontend se sirve desde nginx en `http://localhost:8080`

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Obtener todas las tareas |
| POST | `/api/tasks` | Crear una nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar una tarea |
| DELETE | `/api/tasks/:id` | Eliminar una tarea |

### Ejemplo de uso:

**Crear tarea:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","priority":"High"}'
```

## 🗄️ Estructura de la Base de Datos

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') NOT NULL,
    isCompleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de datos:** MySQL
- **Frontend:** Vanilla JavaScript, Bootstrap 5
- **Otros:** dotenv, cors, mysql2

## 📝 Licencia

MIT
