import React, { FC, FormEvent, useContext, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { FirebaseContext } from "../../../API/Firebase";
import { Notificacion } from "../../../Constants/interfaces";

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
		// let message = "Se ha subido la notificación";
		// try {
		// 	const copy = item!;
		// 	// if(id !== ADD_NEW_ITEM_CODE) await firebase.updateProduct(copy);
		// 	// else await firebase.saveProduct(copy);
		// 	await firebase.setNewNotificacion(copy);
		// 	console.log(copy);
		// } catch (e) {
		// 	console.log(e);
		// 	message =
		// 		"Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet.";
		// }
		// setLoadingSubmit(false);
		// window.alert(message);
		// history.push("/dashboard/notifications");
		console.log("Hello There!");
	};

	// const execDelete = async () => {
	// 	setDeleting(true);
	// 	// firebase.firestore.collection("Products").doc(id).delete().then(e => {
	// 	// 	window.alert("Objeto borrado");
	// 	// 	history.push("/dashboard/menu");
	// 	// }).catch(e => {
	// 	// 	console.log(e);
	// 	// 	setDeleting(false);
	// 	// 	window.alert("Ha ocurrido un error y no se ha podido borrar el objeto.");
	// 	// });
	// };

	const renderItem = () => {
		return (
			<Row>
				<Col xl={6} xs={12}>
					<h4 className="usuario">Usuario</h4>
					<h4 className="not">Notificaciones</h4>
				<div className="maindiv">
                    <Form onSubmit={submitChanges}>
                        <p className="parrafo" id="titulo">Titulo</p>
                        <Form.Control
							className="select"
							type="text"
							placeholder="Titulo de la Notificacion"
							// onChange={}
							// value={item!.}
						/>
                        <hr className="hr1"></hr>
                        <p className="parrafo" id="mensaje">Mensaje Adjuntado</p>
                        <Form.Control
							className="select"
							as="textarea"
							placeholder="Ej. Traer sus propios alimentos"
							rows={3}
							// onChange={}
							// value={item!.}
						/>
                        <br />
                        <p className="parrafo" id="fecha">Fecha</p>
                        <Form.Control
							className="select2"
							onChange={(str) => {
								setItem({
									...item!,
									fecha: new Date(str.currentTarget.value),
								});
							}}
							required={true}
							type='date'
						/>
                        <p className="parrafo" id="hora">Hora</p>
                        <Form.Control
							className="select1"
							onChange={(str) => {
								setItem({
									...item!,
									fecha: new Date(str.currentTarget.value),
								});
							}}
							required={true}
							type='time'
						/>
                        <hr className="hr1"></hr>
						<button type="submit" className="publicar">PUBLICAR</button>
					</Form>
            	</div>
				</Col>
				<Col xl={1}>
				</Col>
				<Col xl={4} xs={12}>
					<h4 className="h">Historial</h4>
					<div className="maindiv1">

					</div>
				</Col>
			</Row>
		);
	};

	return renderItem();
};

export default EditForm;
