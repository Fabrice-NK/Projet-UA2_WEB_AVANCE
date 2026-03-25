import { body, param } from "express-validator";

const subjectRules = [
  body("nom")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("le nom doit contenir au moins 2 caracteres"),
  body("code")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("le code est obligatoire"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage("la description doit contenir au moins 5 caracteres"),
  body("statut")
    .optional({ nullable: true })
    .isIn(["requis", "optionnel"])
    .withMessage("le statut doit etre requis ou optionnel"),
  body("DepartmentId")
    .isInt({ min: 1 })
    .withMessage("DepartmentId doit etre un entier positif"),
  body("LaboratoryId")
    .isInt({ min: 1 })
    .withMessage("LaboratoryId doit etre un entier positif"),
  body("image")
    .optional({ nullable: true })
    .isURL()
    .withMessage("l'image doit etre une URL"),
  param("id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("l'id doit etre un entier positif"),
];

export default subjectRules;