import { Link, useParams } from "react-router-dom";

function DetailPage() {
	const { id } = useParams();

	return (
		<div>
			<h1>Detail equipement: {id}</h1>
			<p>
				<Link to="/equipments">Retour a la liste</Link>
			</p>
			<p>
				<Link to="/equipments/add">Ajouter un autre equipement</Link>
			</p>
		</div>
	);
}

export default DetailPage;
