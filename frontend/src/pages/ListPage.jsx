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
        <div className="container mt-4">
            <h1 className="mb-3">Liste</h1>

            {items.length === 0 ? (
                <p>Chargement...</p>
            ) : (
                items.map((item) => (
                    <div className="card mb-2 p-3" key={item.id}>
                        <h5>{item.nom ?? item.name}</h5>

                        <div className="d-flex gap-2">
                            <Link className="btn btn-primary" to={`/equipments/${item.id}`}>
                                Detail
                            </Link>

                            <Link className="btn btn-warning" to={`/edit/${item.id}`}>
                                Modifier
                            </Link>

                            <button className="btn btn-danger" type="button" onClick={() => handleDelete(item.id)}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ListPage;