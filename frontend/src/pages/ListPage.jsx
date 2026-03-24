import React, { useEffect, useState } from "react";
import { deleteItem, getEquipments as getAllItems } from "../services/api";
import { Link } from "react-router-dom";

function ListPage() {

    const [items, setItems] = useState([]);

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

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
                        {" "}
                        <Link to={`/edit/${item.id}`}>
                            Modifier
                        </Link>
                        {" "}
                        <button type="button" onClick={() => handleDelete(item.id)}>
                            Supprimer
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default ListPage;