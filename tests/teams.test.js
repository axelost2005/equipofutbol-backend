import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

//El codigo fuente es CommonJS y Vitest lo corre de forma nativa, por lo que
//vi.mock no intercepta los require() internos. En su lugar inyectamos un
//cliente de Prisma falso en require.cache ANTES de cargar la app: asi los
//tests no pegan contra la base real.
const prismaMock = {
  team: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

const clientPath = require.resolve("../src/prisma/prismaClient");
require.cache[clientPath] = {
  id: clientPath,
  filename: clientPath,
  loaded: true,
  exports: prismaMock,
};

const app = require("../src/app");
const request = require("supertest");

//equipo valido de referencia para los tests de creacion
const validTeam = {
  name: "Boca Juniors",
  country: "Argentina",
  league: "Liga Profesional",
  stadium: "La Bombonera",
  founded: 1905,
  coach: "Fernando Gago",
  shortDescription: "El Xeneize",
  description: "Club Atlético Boca Juniors",
  category: "Primera",
  titles: 74,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/health", () => {
  it("responde 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/equipos", () => {
  it("devuelve data y meta", async () => {
    prismaMock.team.findMany.mockResolvedValue([{ id: "1" }, { id: "2" }]);
    prismaMock.team.count.mockResolvedValue(30);

    const res = await request(app).get("/api/equipos");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toMatchObject({ total: 30, page: 1, limit: 8, totalPages: 4 });
  });
});

describe("GET /api/equipos/:id", () => {
  it("con id inexistente devuelve 404", async () => {
    prismaMock.team.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/equipos/11111111-1111-1111-1111-111111111111");

    expect(res.status).toBe(404);
  });

  it("con id mal formado devuelve 400 y no tira el servidor", async () => {
    //simula el error del driver de PostgreSQL ante un UUID invalido
    const err = new Error("invalid input syntax for type uuid");
    err.code = "22P02";
    prismaMock.team.findUnique.mockRejectedValue(err);

    const res = await request(app).get("/api/equipos/asdasd");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Identificador inválido");
  });
});

describe("POST /api/equipos", () => {
  it("con body invalido devuelve 400 con details", async () => {
    const res = await request(app).post("/api/equipos").send({ name: "Solo nombre" });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it("duplicado devuelve 409", async () => {
    //el body es valido, pero ya existe un equipo con ese nombre
    prismaMock.team.findFirst.mockResolvedValue({ id: "1", name: validTeam.name });

    const res = await request(app).post("/api/equipos").send(validTeam);

    expect(res.status).toBe(409);
  });
});
