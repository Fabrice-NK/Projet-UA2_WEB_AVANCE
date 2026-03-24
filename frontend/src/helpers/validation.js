// Validation helper functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

export const validateNom = (nom) => {
  if (!nom.trim()) return "Name is required";
  if (nom.trim().length < 3) return "Name must be at least 3 characters";
  if (nom.trim().length > 100) return "Name must not exceed 100 characters";
  return "";
};

export const validateDescription = (description) => {
  if (description && description.length > 500) {
    return "Description must not exceed 500 characters";
  }
  return "";
};

export const validateImage = (file) => {
  if (!file) return "";
  
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Image must be JPEG, PNG, GIF, or WebP";
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return "Image must not exceed 5MB";
  }
  
  return "";
};

export const validatePassword = (password) => {
  if (!password.trim()) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

// Validate all fields for AddPage
export const validateAddPageForm = (nom, description, image) => {
  const errors = {};
  
  const nomError = validateNom(nom);
  if (nomError) errors.nom = nomError;
  
  const descError = validateDescription(description);
  if (descError) errors.description = descError;
  
  const imageError = validateImage(image);
  if (imageError) errors.image = imageError;
  
  return errors;
};

// Validate all fields for EditPage
export const validateEditPageForm = (nom, description) => {
  const errors = {};
  
  const nomError = validateNom(nom);
  if (nomError) errors.nom = nomError;
  
  const descError = validateDescription(description);
  if (descError) errors.description = descError;
  
  return errors;
};

// Validate all fields for LoginPage
export const validateLoginForm = (email, password) => {
  const errors = {};
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};
