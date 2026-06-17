//rutas de equipos: asocia cada endpoint con su controlador
const { Router } = require("express");
const teamsController = require("../controllers/teams.controller");

const router = Router();

//GET /api/equipos -> listado con paginacion y busqueda
router.get("/", teamsController.getTeams);
//GET /api/equipos/:id -> buscar equipo por id
router.get('/:id', teamsController.getTeamById);
//POST /api/equipos/ -> ingresar un equipo nuevo 
router.post('/', teamsController.createTeam);
//PUT /api/equipos/:id -> actualizar equipo por id 
router.put("/:id", teamsController.updateTeam);
//DELETE /api/equipos/:id -> eliminar equipo por id s
router.delete("/:id", teamsController.deleteTeam);

module.exports = router;