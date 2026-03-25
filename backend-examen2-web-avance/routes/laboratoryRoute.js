import { Router } from "express";
import { addLaboratory, deleteLaboratory, detailsLaboratory, laboratoryEquipments, laboratoryList, laboratorySubjects, updateLaboratory, updateLaboratoryImage } from "../controllers/laboratoryController.js";
import upload from "../helpers/fileLoader.js";
import { verifierToken } from "../authentification/verifierToken.js";
import laboratoryRules from "../validations/laboratoryValidation.js";


const route = Router()

route
.get('/', laboratoryList)
    
    .get('/:id', detailsLaboratory)

    .get('/:id/equipment', laboratoryEquipments)
    .get('/:id/subjects', laboratorySubjects)
    .all("*", verifierToken)

    .post('/', upload.single('image'), laboratoryRules, addLaboratory)
    .delete('/:id', deleteLaboratory)
    .put('/:id', laboratoryRules, updateLaboratory)
    .put('/:id/image', upload.single('image'), updateLaboratoryImage)
export default route
