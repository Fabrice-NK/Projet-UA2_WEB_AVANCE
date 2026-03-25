import bcrypt from "bcryptjs";
import { User } from "./models/relation.js";
import "./config/connection.js";

const createUser = async () => {
  try {
    const hashedPassword = bcrypt.hashSync("admin123", 10);

    const user = await User.create({
      nom: "superadmin1",
      prenom: "superadmin1",
      role: "admin",
      email: "superadmin1@superadmin.com",
      mot_de_passe: hashedPassword,
    });

    console.log("✅ Utilisateur créé :", user.toJSON());
    process.exit();
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit();
  }
};

createUser();