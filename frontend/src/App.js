import { useEffect, useState } from "react";
import { getData } from "./services/api";

function App() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getData()
            .then((result) => {
                setData(result);
            })
            .catch((err) => {
                setError(err.message || "Impossible de charger les donnees");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>Données :</h1>

            {loading && <p>Chargement...</p>}
            {error && <p>Erreur: {error}</p>}

            {!loading && !error && data.map((item, index) => (
                <div key={index}>
                    {JSON.stringify(item)}
                </div>
            ))}
        </div>
    );
}

export default App;