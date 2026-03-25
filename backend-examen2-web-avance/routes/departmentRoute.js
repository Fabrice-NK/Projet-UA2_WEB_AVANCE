import { Router } from "express";
import { addDepartment, deleteDepartment, departmentList, departmentSubjects, departmentUsers, detailsDepartment, updateDepartment, updateDepartmentImage } from "../controllers/departmentController.js";
import upload from "../helpers/fileLoader.js";
import {verifierToken} from "../authentification/verifierToken.js"
import departmentRules from "../validations/departmentValidation.js";

const route = Router()

route
    .get('/', departmentList)
    .get('/:id', detailsDepartment)
    .get('/:id/users', departmentUsers)
    .get('/:id/subjects', departmentSubjects)
    .all("*", verifierToken)
    .post('/', upload.single('image'), departmentRules, addDepartment)
    .delete('/:id', deleteDepartment)
    .put('/:id', departmentRules, updateDepartment)
    .put('/:id/image', upload.single('image'), updateDepartmentImage)
export default route