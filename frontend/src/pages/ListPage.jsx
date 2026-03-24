import React, { useEffect, useState } from "react";
import { getEquipments as getAllItems } from "../services/api";
import { Link } from "react-router-dom";

function ListPage() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        getAllItems()
            .then(data => setItems(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Liste</h1>

            {items.length === 0 ? (
                <p>Chargement...</p>
            ) : (
                items.map(item => (
                    <div key={item.id}>
                        <p>{item.nom}</p>

                        <Link to={`/equipments/${item.id}`}>
                            Voir détail
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default ListPage;