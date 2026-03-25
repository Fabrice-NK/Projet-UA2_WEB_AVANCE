import { body, param } from "express-validator";

const laboratoryRules = [
  body("nom")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("le nom doit contenir au moins 2 caracteres"),
  body("salle")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("la salle doit etre une chaine valide"),
  body("information")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage("l'information doit contenir au moins 10 caracteres"),
  body("DepartmentId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("DepartmentId doit etre un entier positif"),
  body("image")
    .optional({ nullable: true })
    .isURL()
    .withMessage("l'image doit etre une URL"),
  param("id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("l'id doit etre un entier positif"),
];

export default laboratoryRules;