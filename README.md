"# Projet-UA2_WEB_AVANCE" 

# Projet Web Avancé — Frontend React + Backend API

## Description

Ce projet est une application web réalisée dans le cadre du cours de **Web Avancé**.  
Elle permet de gérer plusieurs entités académiques à partir d’un backend déjà existant, notamment :

- les utilisateurs
- les départements
- les rôles
- les matières
- les laboratoires
- les équipements

Dans cette implémentation frontend, l’accent est mis pour  le moment sur les entités:

- **Laboratory**
- **Equipment**

Les autres etant en cours

L’application consomme une API REST existante et met en œuvre les fonctionnalités suivantes :

- authentification utilisateur
- protection des routes côté frontend
- navigation avec React Router
- gestion d’état avec Redux Toolkit
- appels API avec Axios
- formulaires avec validation
- CRUD complet
- affichage des relations entre entités
- interface responsive

---

## Objectif du projet

L’objectif principal est de construire une interface frontend moderne avec **React** en s’appuyant sur un backend fourni.

Le projet respecte les concepts suivants :

- utilisation de **React**
- gestion des routes avec **React Router**
- authentification frontend
- routes protégées
- formulaires avec validation
- appels HTTP avec **Axios**
- gestion globale de l’état avec **Redux Toolkit**
- affichage relationnel entre entités
- structure de projet claire et maintenable

---

## Technologies utilisées

### Frontend
- React
- React Router DOM
- Redux Toolkit
- React Redux
- Axios
- React Hook Form
- Yup
- CSS

### Backend
- Node.js
- Express
- Sequelize
- Base de données relationnelle

---

## Entités principales utilisées

### Laboratory
Champs principaux :
- `nom`
- `salle`
- `information`
- `image`

### Equipment
Champs principaux :
- `nom`
- `modele`
- `description`
- `image`

Valeurs possibles pour `modele` :
- `nouveau`
- `ancien`
- `refait`

---

## Relations importantes

Les relations principales définies dans le backend sont :

- un **Department** possède plusieurs **User**
- un **Department** possède plusieurs **Subject**
- un **Department** possède plusieurs **Laboratory**
- un **Laboratory** possède plusieurs **Subject**
- un **Laboratory** possède plusieurs **Equipment**
- un **User** peut avoir plusieurs **Role**
- un **User** peut avoir plusieurs **Subject**

Dans ce projet frontend, la relation la plus exploitée est :

- **Laboratory hasMany Equipment**
- **Equipment belongsTo Laboratory**

Cela permet d’afficher les équipements associés à un laboratoire.

---

## Endpoints API utilisés

Base URL :

```bash
http://localhost:5000/api




src/
│
├── app/
│   └── store.js
│
├── components/
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
│
├── features/
│   └── auth/
│       └── authSlice.js
│
├── pages/
│   ├── login/
│   │   └── LoginPage.jsx
│   │
│   ├── laboratory/
│   │   ├── LaboratoryAddPage.jsx
│   │   ├── LaboratoryDetailPage.jsx
│   │   ├── LaboratoryEditPage.jsx
│   │   └── LaboratoryListPage.jsx
│   │
│   └── equipment/
│       ├── EquipmentAddPage.jsx
│       ├── EquipmentDetailPage.jsx
│       ├── EquipmentEditPage.jsx
│       └── EquipmentListPage.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   ├── api.js
│   ├── laboratoryService.js
│   └── equipmentService.js
│
├── styles/
│   └── global.css
│
├── App.jsx
└── main.jsx