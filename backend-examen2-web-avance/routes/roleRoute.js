//Importer la fonction Router pour la creation des routes
import { Router } from "express";


//Importer les controllers
import { addRole, deleteRole, roleList, roleById, roleUsers, updateRole } from "../controllers/roleController.js";
import { verifierToken } from "../authentification/verifierToken.js";
import autoriser from "../authentification/autorisation.js";
import roleRules from "../validations/roleValidation.js";

// Creation d"une instance de Router
const roleRoute = Router()

roleRoute
    .get('/', roleList)
    .all("*", verifierToken)
    .post('/', roleRules, addRole)
    .put('/:id', roleRules, updateRole)
    .delete('/:id', deleteRole)
    .get('/:id', roleById)
    .get('/:id/users', roleUsers)

export default roleRoute