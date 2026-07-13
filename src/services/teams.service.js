//logica de acceso a datos de equipos usando Prisma
const prisma = require("../prisma/prismaClient");

//obtiene equipos desde PostgreSQL con paginacion y busqueda por nombre
const getTeams = async ({ page, limit, search }) => {
  //si hay termino de busqueda, filtra por nombre sin distinguir mayusculas
  const where = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  //la pagina de datos y el total corren en paralelo para no encadenar dos round-trips
  const [data, total] = await Promise.all([
    prisma.team.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.team.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const getTeamById = async (id) => {
  return prisma.team.findUnique({
    where: {
      id
      /**si el model Team cambia a int @id @default(autoincrement())
       * o valor numerico manual en el seed, cambiar a:
       * id: Number(id),
       */
    }
  });
};
const createTeam = async (teamData) =>{
  return prisma.team.create({
    data: teamData,
  });
}
const getTeamByName = async (name) => {
  return prisma.team.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
};
const updateTeam = async (id, teamData) => {
  const existingTeam = await prisma.team.findUnique({
    where: {id}
  });
  if (!existingTeam) {
    return null;
  }
  return await prisma.team.update({
    where: {id},
    data: teamData
  });
};
const deleteTeam = async (id) =>{
  const deletedTeam = await prisma.team.delete({
    where: {id}
  });
  return deletedTeam;
}
module.exports = { getTeams , getTeamById, createTeam, getTeamByName , updateTeam, deleteTeam};
