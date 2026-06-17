//controladores de equipos: leen la request, llaman al service y arman la respuesta
const teamsService = require("../services/teams.service");
const teamValidation = require("../validations/team.validation");

//GET /api/equipos?page=1&limit=8&search=boca
const getTeams = async (req, res) => {
  try {
    //page por defecto 1, limit por defecto 8; se ignoran valores invalidos o negativos
    const parsedPage = parseInt(req.query.page, 10);
    const parsedLimit = parseInt(req.query.limit, 10);
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 8;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const teams = await teamsService.getTeams({ page, limit, search });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error obteniendo equipos:", error);
    res.status(500).json({ error: "Error inesperado del servidor" });
  }
};
// GET /api/equipos/:id 
const getTeamById = async (req, res) => {
  const id = req.params.id;
  const team = await teamsService.getTeamById(id);

  if (!team) {
    return res.status(404).json({
      error: "Recurso no encontrado"
    });
  }

  return res.status(200).json(team);
};
const createTeam = async (req, res) => {
  const validName = await teamsService.getTeamByName(req.body.name);
  if(validName){
    return res.status(409).json({
      error: 'Equipo ya ingresado',
    });
  }
  const validation = await teamValidation.validateTeam(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Datos equipo invalidos',
      details: validation.errors,
    });
  }
  const creado = await teamsService.createTeam(req.body);
  return res.status(201).json(creado);
}
const updateTeam = async (req, res) => {
  const id = req.params.id;
  const validation = teamValidation.validateTeam(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: validation.errors
    });
  }
  const updatedTeam = await teamsService.updateTeam( id ,req.body);
  if (!updatedTeam) {
    return res.status(404).json({
      error: "Equipo no encontrado"
    });
  }
  return res.status(200).json(updatedTeam);
};
const deleteTeam = async (req,res) =>{
  const id = req.params.id;
  const existe = await teamsService.getTeamById(id);
  if (!existe) {
    return res.status(404).json({
      error: "Recurso no encontrado"
    });
  }
  await teamsService.deleteTeam(id);
  return res.status(200).json({ message: "Equipo eliminado correctamente" });
}

module.exports = { getTeams, getTeamById, createTeam , updateTeam, deleteTeam};
