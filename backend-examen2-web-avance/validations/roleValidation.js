import { body, param } from "express-validator";

const roleRules = [
  body("titre")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("le titre doit contenir au moins 2 caracteres"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage("la description doit contenir au moins 5 caracteres"),
  param("id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("l'id doit etre un entier positif"),
];

export default roleRules;