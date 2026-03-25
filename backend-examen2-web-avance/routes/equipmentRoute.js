import { Router } from "express";
import { addDepartment, deleteDepartment, departmentList, departmentSubjects, departmentUsers, detailsDepartment, updateDepartment, updateDepartmentImage } from "../controllers/departmentController.js";
import upload from "../helpers/fileLoader.js";
import { addEquipment, deleteEquipment, detailsEquipment, equipmentList, updateEquipment, updateEquipmentImage } from "../controllers/equipmentController.js";
import { verifierToken } from "../authentification/verifierToken.js";
import autoriser from "../authentification/autorisation.js";
import equipmentRules from "../validations/equipmentValidation.js";

const route = Router()

route
    .get('/', equipmentList)
    .get('/:id', detailsEquipment)
    .all("*", verifierToken)
    .put('/:id', equipmentRules, updateEquipment)
    .post('/', upload.single('image'), equipmentRules, addEquipment)
    .delete('/:id', deleteEquipment)
    .put('/:id/image', upload.single('image'), updateEquipmentImage)

export default route