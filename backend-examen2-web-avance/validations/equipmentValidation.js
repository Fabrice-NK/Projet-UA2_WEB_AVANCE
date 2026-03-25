import { body, param } from "express-validator";

const equipmentRules = [
  body("nom")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("le nom doit contenir au moins 2 caracteres"),
  body("modele")
    .isIn(["nouveau", "ancien", "refait"])
    .withMessage("le modele doit etre nouveau, ancien ou refait"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage("la description doit contenir au moins 5 caracteres"),
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

export default equipmentRules;