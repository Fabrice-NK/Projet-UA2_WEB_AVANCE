// import React from "react";

// function App() {
//     return (
//         <div style={{ padding: "16px" }}>
//             <h1>Gestion Laboratoire - Test</h1>
//             <p>La page charge bien!</p>
//         </div>
//     );
// }

// export default App;


// Ce fichier est le composant principal de l'application React. Il importe les routes définies dans AppRoutes et les rend. AppRoutes contient toutes les routes de l'application, y compris les pages de connexion, de liste, d'ajout, de modification et de détail pour les laboratoires et les équipements. Le composant App est ensuite utilisé dans le point d'entrée de l'application (main.jsx) pour rendre l'ensemble de l'application dans le DOM.
import React from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;