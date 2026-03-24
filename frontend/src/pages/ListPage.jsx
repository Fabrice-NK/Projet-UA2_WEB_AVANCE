import { Link } from "react-router-dom";

const equipments = [
    { id: 1, name: "Microscope" },
    { id: 2, name: "Centrifugeuse" },
    { id: 3, name: "Balance" },
];

function ListPage() {
    return (
        <div>
            <h1>Page Liste</h1>

            <p>
                <Link to="/equipments/add">Ajouter un equipement</Link>
            </p>

            <ul>
                {equipments.map((equipment) => (
                    <li key={equipment.id}>
                        {equipment.name} - <Link to={`/equipments/${equipment.id}`}>Voir detail</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListPage;