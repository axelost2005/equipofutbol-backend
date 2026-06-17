# EquipoFutbol — Backend

API REST desarrollada con **Node.js**, **Express**, **Prisma ORM** y **PostgreSQL** para dar soporte a la aplicación EquipoFutbol desarrollada previamente en React.

> Trabajo Práctico: REST API y Express — Programación Web Avanzada, Facultad de Informática (UNCOMA).

## Integrantes del grupo

<!-- TODO: completar nombres y legajos de todos los integrantes -->
- Tomás Sánchez
- Jorge V.
-
-

## Links

| Recurso | Link |
|---------|------|
| Repositorio del frontend | <!-- TODO: link al repo de React --> |
| Tablero Kanban (Linear) | <!-- TODO: link al tablero --> |
| Deploy del backend (Vercel) | <!-- TODO: completar al hacer el deploy --> |
| Deploy del frontend actualizado | <!-- TODO: completar si corresponde --> |

## Descripción de la aplicación

EquipoFutbol es una aplicación para explorar y administrar equipos de fútbol: permite listar equipos, ver el detalle de cada uno, buscarlos y filtrarlos, y administrarlos mediante operaciones CRUD. Este backend reemplaza la persistencia en `localStorage` del TP de React por una API propia conectada a una base de datos PostgreSQL.

## Entidad principal: `Team`

Representa un equipo de fútbol. Definida en [`prisma/schema.prisma`](prisma/schema.prisma):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `String` (uuid) | Identificador único |
| `name` | `String` | Nombre del equipo |
| `country` | `String` | País |
| `league` | `String` | Liga en la que juega |
| `stadium` | `String` | Estadio |
| `founded` | `Int` | Año de fundación |
| `coach` | `String` | Director técnico |
| `shortDescription` | `String` | Descripción corta |
| `description` | `String` | Descripción completa |
| `logo` | `String?` | URL del escudo (opcional) |
| `image` | `String?` | URL de imagen (opcional) |
| `category` | `String` | Categoría |
| `titles` | `Int` | Cantidad de títulos |
| `createdAt` | `DateTime` | Fecha de creación del registro |
| `updatedAt` | `DateTime` | Fecha de última actualización |

## Instalación y ejecución local

Requisitos previos: **Node.js 18+** y una base de datos **PostgreSQL** (local o en [Neon](https://neon.tech)).

```bash
# 1. Clonar el repositorio
git clone https://github.com/ttomisanchezz/EquipoFutbol-backend.git
cd EquipoFutbol-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)

# 4. Ejecutar migraciones (ver sección de migraciones)

# 5. Levantar el servidor en modo desarrollo
npm run dev
```

Para producción:

```bash
npm start
```

El servidor queda escuchando en `http://localhost:3000` (o el puerto definido en `PORT`).

Ruta de prueba:

```
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "API funcionando correctamente"
}
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto usando `.env.example` como referencia:

```
DATABASE_URL=postgresql://usuario:password@host:5432/basededatos
PORT=3000
FRONTEND_URL=http://localhost:5173
```

- `DATABASE_URL`: cadena de conexión a PostgreSQL (local o de Neon).
- `PORT`: puerto donde corre la API (por defecto 3000).
- `FRONTEND_URL`: origen permitido para CORS (URL del frontend).

⚠️ **Nunca subir el archivo `.env` real al repositorio.** Las credenciales se comparten por mensajería privada.

## Migraciones

Aplicar las migraciones y generar el cliente de Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Las migraciones generadas viven en [`prisma/migrations/`](prisma/migrations/).

## Seed

<!-- TODO: actualizar cuando se implemente el seed -->

Cargar los datos iniciales (20-30 equipos de prueba):

```bash
npx prisma db seed
```

## Endpoints de la API

<!-- TODO: actualizar cuando se implemente el CRUD y agregar capturas/ejemplos -->

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check de la API |
| GET | `/api/teams` | Listar todos los equipos *(en desarrollo)* |
| GET | `/api/teams/:id` | Detalle de un equipo *(en desarrollo)* |
| POST | `/api/teams` | Crear un equipo *(en desarrollo)* |
| PUT | `/api/teams/:id` | Actualizar un equipo *(en desarrollo)* |
| DELETE | `/api/teams/:id` | Eliminar un equipo *(en desarrollo)* |
