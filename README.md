# ⚽ EquipoFútbol API

REST API para administrar equipos de fútbol: listado paginado con búsqueda, CRUD completo, validación de datos y manejo de errores centralizado. Backend serverless construido con Node.js, Express, Prisma y PostgreSQL.

**🔗 Demo en vivo:** **[equipofutbol-backend.vercel.app/api/equipos](https://equipofutbol-backend.vercel.app/api/equipos)**

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)

---

## Descripción

API que expone una entidad `Team` (equipo de fútbol) sobre una base PostgreSQL. Permite listar equipos con paginación y búsqueda por nombre, obtener el detalle de uno, y crear, reemplazar, actualizar parcialmente y eliminar registros. Pensada para consumirse desde un frontend (SPA) o cualquier cliente HTTP.

## Stack

| Capa | Tecnología |
|------|------------|
| Runtime | Node.js 22 (CommonJS) |
| Framework | Express 4 |
| ORM | Prisma 7 con *driver adapter* de PostgreSQL (`@prisma/adapter-pg`) |
| Base de datos | PostgreSQL (Neon) |
| Testing | Vitest + Supertest |
| Deploy | Vercel (serverless) |

## Arquitectura

El proyecto separa responsabilidades en capas, cada una con una única razón para cambiar:

```
routes → controllers → services → prisma
                     ↘ validations
```

- **routes**: definen los endpoints y los asocian a un controlador.
- **controllers**: leen la request, orquestan la respuesta y devuelven los códigos HTTP.
- **services**: encapsulan el acceso a datos vía Prisma. Los controladores no conocen Prisma.
- **validations**: reglas de validación por campo, reutilizadas por la validación completa (POST/PUT) y la parcial (PATCH).

### Decisiones de diseño

- **`asyncHandler` para errores async.** En Express 4 una promesa rechazada dentro de un controlador `async` no la captura Express: queda como *unhandled rejection* y puede tumbar el proceso. Cada controlador se envuelve en un `asyncHandler` que reenvía cualquier rechazo al middleware de errores, evitando un `try/catch` repetido en cada handler.

- **Manejo de errores centralizado.** Un único `errorHandler` traduce los códigos de Prisma/PostgreSQL a HTTP con sentido y responde siempre en JSON, sin filtrar el stack al cliente. Es la única fuente de verdad para el mapeo error → status.

- **IDs como UUID, no secuenciales.** Cada equipo usa un `id` UUID. Un ID incremental (`1, 2, 3…`) es enumerable: expone cuántos registros hay y permite recorrerlos. El UUID no se puede adivinar ni filtra información, y es seguro de exponer en la URL.

- **Paginación con metadatos.** El listado devuelve `data` + `meta` (`total`, `page`, `limit`, `totalPages`) para que el cliente sepa cuántas páginas hay. La página y el conteo se consultan en paralelo (`Promise.all`) y el `limit` está topeado a 50.

- **CORS configurable por entorno.** Los orígenes permitidos se leen de `FRONTEND_URL` (varios separados por coma); si la variable no está, se permite todo (cómodo en desarrollo).

## Entidad `Team`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (UUID) | Generado automáticamente |
| `name` | `String` | Requerido, único a nivel de aplicación |
| `country` | `String` | Requerido |
| `league` | `String` | Requerido |
| `stadium` | `String` | Requerido |
| `founded` | `Int` | Año entre 1800 y el actual |
| `coach` | `String` | Requerido |
| `shortDescription` | `String` | Requerido |
| `description` | `String` | Requerido |
| `logo` | `String?` | Opcional, formato `/logos/...` |
| `image` | `String?` | Opcional, formato `/images/...` |
| `category` | `String` | Requerido |
| `titles` | `Int` | ≥ 0 |
| `createdAt` / `updatedAt` | `DateTime` | Automáticos |

## Endpoints

Base URL: `https://equipofutbol-backend.vercel.app`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/equipos` | Listado paginado (`?page`, `?limit`, `?search`) |
| `GET` | `/api/equipos/:id` | Detalle de un equipo |
| `POST` | `/api/equipos` | Crear un equipo |
| `PUT` | `/api/equipos/:id` | Reemplazo total (todos los campos) |
| `PATCH` | `/api/equipos/:id` | Actualización parcial |
| `DELETE` | `/api/equipos/:id` | Eliminar un equipo |

### `GET /api/equipos`

Query params: `page` (default `1`), `limit` (default `8`, máximo `50`), `search` (filtra por nombre, sin distinguir mayúsculas).

```http
GET /api/equipos?page=1&limit=8&search=boca
```

```json
{
  "data": [
    {
      "id": "9c1e7b0a-3f2d-4a1b-8e5c-2b6d0f9a1c34",
      "name": "Boca Juniors",
      "country": "Argentina",
      "league": "Liga Profesional",
      "stadium": "Alberto J. Armando (La Bombonera)",
      "founded": 1905,
      "coach": "Fernando Gago",
      "shortDescription": "El Xeneize, uno de los clubes más populares de Argentina.",
      "description": "Club Atlético Boca Juniors, fundado en 1905 en el barrio de La Boca.",
      "logo": "/logos/boca.png",
      "image": "/images/boca.jpg",
      "category": "Primera",
      "titles": 74,
      "createdAt": "2026-07-13T20:57:12.000Z",
      "updatedAt": "2026-07-13T20:57:12.000Z"
    }
  ],
  "meta": { "total": 26, "page": 1, "limit": 8, "totalPages": 4 }
}
```

### `POST /api/equipos`

```http
POST /api/equipos
Content-Type: application/json
```

```json
{
  "name": "River Plate",
  "country": "Argentina",
  "league": "Liga Profesional",
  "stadium": "Más Monumental",
  "founded": 1901,
  "coach": "Marcelo Gallardo",
  "shortDescription": "El Millonario.",
  "description": "Club Atlético River Plate, fundado en 1901.",
  "logo": "/logos/river.png",
  "image": "/images/river.jpg",
  "category": "Primera",
  "titles": 70
}
```

Respuesta `201 Created` con el equipo creado.

### `PATCH /api/equipos/:id`

Actualiza solo los campos enviados (requiere al menos uno).

```json
{ "coach": "Nuevo Director Técnico", "titles": 71 }
```

Respuesta `200 OK` con el equipo actualizado.

## Códigos de error

Todos los errores se devuelven en JSON.

| Status | Cuándo | Ejemplo de respuesta |
|--------|--------|----------------------|
| `400` | Body inválido | `{ "error": "Datos equipo invalidos", "details": ["name is required"] }` |
| `400` | ID con formato inválido | `{ "error": "Identificador inválido" }` |
| `404` | Recurso inexistente | `{ "error": "Recurso no encontrado" }` |
| `409` | Nombre de equipo duplicado | `{ "error": "Equipo ya ingresado" }` |
| `500` | Error inesperado (sin stack al cliente) | `{ "error": "Error inesperado del servidor" }` |

## Instalación local

Requisitos: **Node.js 20.19+** (recomendado 22) y una base **PostgreSQL** (local o [Neon](https://neon.tech)).

```bash
# 1. Clonar
git clone https://github.com/axelost2005/equipofutbol-backend.git
cd equipofutbol-backend

# 2. Dependencias
npm install

# 3. Variables de entorno
cp .env.example .env
# editar .env y completar DATABASE_URL

# 4. Migraciones + datos de ejemplo
npx prisma migrate deploy
npm run db:seed

# 5. Levantar en desarrollo
npm run dev
```

El servidor queda en `http://localhost:3000`.

## Variables de entorno

```
DATABASE_URL=postgresql://usuario:password@host:5432/basededatos?sslmode=require
PORT=3000
FRONTEND_URL=http://localhost:5173
```

- `DATABASE_URL`: conexión a PostgreSQL. En Neon, para el runtime serverless conviene el endpoint *pooled* (`-pooler`); para migraciones, la conexión directa.
- `PORT`: puerto local (default `3000`). No aplica en el deploy serverless.
- `FRONTEND_URL`: origen(es) permitido(s) por CORS, separados por coma.

## Scripts

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor con recarga (nodemon) |
| `npm start` | Servidor en producción |
| `npm test` | Suite de tests (Vitest) |
| `npm run db:seed` | Carga datos de ejemplo |

## Tests

Tests de integración con **Vitest + Supertest** sobre la API completa. Prisma se mockea (no se pega contra la base real), cubriendo: health check, listado con `data`/`meta`, 404 por ID inexistente, 400 por ID mal formado sin tumbar el servidor, 400 por body inválido con `details`, y 409 por duplicado.

```bash
npm test
```

## Deploy

Desplegado en **Vercel** como función serverless: `api/index.js` exporta la app de Express como handler y `vercel.json` reescribe todo el tráfico hacia ella. El cliente de Prisma se genera en el build (`postinstall`) dentro del código fuente para que quede incluido en el bundle de la función.
