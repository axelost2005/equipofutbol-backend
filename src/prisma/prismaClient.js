//Crear cliente de Prisma con driver adapter de PostgreSQL (requerido por Prisma 7)
//el cliente se importa desde src/generated/prisma (ver output en schema.prisma)
const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");

//el adapter se conecta a la base usando la URL definida en las variables de entorno
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
