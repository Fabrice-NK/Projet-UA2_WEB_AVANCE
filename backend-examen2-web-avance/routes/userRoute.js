//Importer la fonction Router pour la creation des routes
import { Router } from "express";

//Importer les controllers
import { addUser, addUserToRoles, addUserToSubjects, deleteUser, updateUser, updateUserPhoto, userById, userDepartment, userList, userSubjects } from "../controllers/userController.js";

//Importer la fonction pour charger les images/fichiers
import upload from "../helpers/fileLoader.js";
import { verifierToken } from "../authentification/verifierToken.js";
import userRules from "../validations/userValidation.js";

// Creation d"une instance de Router
const route = Router()

route
    .post('/', upload.single('photo'), userRules, addUser)
    .all("*", verifierToken)
    .put('/:id', userRules, updateUser)
    .put('/:id/photo', upload.single('photo'), updateUserPhoto)
    .get('/:id', userById)
    .get('/:id/department', userDepartment)
    .get('/', userList)
    .get('/:id/subjects', userSubjects)
    .delete('/:id', deleteUser)
    .post('/:id/roles', addUserToRoles)
    .post('/:id/subjects', addUserToSubjects)

export default route