import React, { FC, FormEvent, useContext, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { FirebaseContext } from "../../../API/Firebase";
import { Notificacion } from "../../../Constants/interfaces";

import "../style.css";
import "./style.css";

const EditForm: FC = () => {
	// const { id } = useParams<{ id: string }>();
	const [item, setItem] = useState<Notificacion>({
		id: "",
		descripcion: "",
		fecha: new Date(),
		lifetime: 24,
	});
	const [image, setImage] = useState<File | undefined>();
	const [deleteItem, setDeleteItem] = useState<boolean>(false);

	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [changeImage, setChangeImage] = useState<boolean>(false);

	const firebase = useContext(FirebaseContext);
	const history = useHistory();

	useEffect(() => {
		// if(id !== ADD_NEW_ITEM_CODE){
		// 	firebase.getProductFromId("Products/"+id).then(product => setNItem(product)).catch(e => {
		// 		console.log(e);
		// 		window.alert("This item appears to be non-existant");
		// 		history.push("/dashboard/menu");
		// 	});
		// } else {
		setItem({
			id: "",
			descripcion: "",
			fecha: new Date(),
			lifetime: 24,
		});
		// }
		// eslint-disable-next-line
	}, []);

	const submitChanges = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoadingSubmit(true);
		let message = "Se ha subido la notificación";
		try {
			const copy = item!;
			// if(id !== ADD_NEW_ITEM_CODE) await firebase.updateProduct(copy);
			// else await firebase.saveProduct(copy);
			await firebase.setNewNotificacion(copy);
			console.log(copy);
		} catch (e) {
			console.log(e);
			message =
				"Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet.";
		}
		setLoadingSubmit(false);
		window.alert(message);
		history.push("/dashboard/notifications");
	};

	const execDelete = async () => {
		setDeleting(true);
		// firebase.firestore.collection("Products").doc(id).delete().then(e => {
		// 	window.alert("Objeto borrado");
		// 	history.push("/dashboard/menu");
		// }).catch(e => {
		// 	console.log(e);
		// 	setDeleting(false);
		// 	window.alert("Ha ocurrido un error y no se ha podido borrar el objeto.");
		// });
	};

	const renderItem = () => {
		return (
			<div>
            <h1>Punto Blanco</h1>
            <hr />
            <main className="title1">Notificaciones</main>
            <main className="title2">Historial</main>
            <div className="maindiv">
                <main className="notif">
                    <form className="fNotif">
                        <p className="parrafo" id="titulo">Titulo</p>
                        <input className="select"></input>
                        <hr className="hr1"></hr>
                        <p className="parrafo" id="mensaje">Mensaje Adjuntado</p>
                        <textarea></textarea>
                        <br />
                        <p className="parrafo" id="fecha">Fecha</p>
                        <input type="datetime-local"></input>
                        <p className="parrafo" id="hora">Hora</p>
                        <input type="time"></input>
                        <hr className="hr1"></hr>
                        <button type="submit" className="publicar">PUBLICAR</button>
                    </form>
                </main>
                <main className="historial"> 
                </main>
            </div>
        </div>
		);
	};

	return renderItem();
};

export default EditForm;
