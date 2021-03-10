import React, { FC, FormEvent, useContext, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { FirebaseContext } from "../../../API/Firebase";
import { Notificacion } from "../../../Constants/interfaces";

import "../style.css";

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

	const saveFileLocally = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files === null || files.length === 0) {
			setImage(undefined);
			return;
		}
		setImage(files.item(0)!);
		console.log(files.item(0)?.name);
		return;
	};

	const changeOnlyImage = async () => {
		if (image !== undefined && image !== null) {
			setChangeImage(true);
			// firebase.uploadImage(image).then(url => {
			// 	if (typeof url === "string") {
			// 		if(id !== ADD_NEW_ITEM_CODE){
			// 			firebase.firestore.collection("Products").doc(id).update({ imageURL: url })
			// 			.then(a => {
			// 				window.alert("La imagen se ha cambiado con exito");
			// 				setNItem({
			// 					...item!,
			// 					imageURL : url
			// 				})
			// 			})
			// 			.catch(e => {console.log(e);window.alert("La imagen no ha podido actualizarse");});
			// 		} else {
			// 			window.alert("La imagen se ha cambiado con exito");
			// 			setNItem({
			// 				...item!,
			// 				imageURL : url
			// 			})
			// 		}
			// 	} else {
			// 		console.log(url);
			// 	}
			// }).catch(e => {console.log(e);window.alert("La imagen no ha podido cargarse");})
			// .finally(() => setChangeImage(false));
		}
	};

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

	const deleteItemButtons = (
		<>
			<button
				disabled={deleting}
				className='button warning-button'
				onClick={() => setDeleteItem(true)}
			>
				{deleting ? "Borrando..." : "Borrar Producto"}
			</button>
			{deleteItem ? (
				<div style={{ paddingTop: "10px" }}>
					<h5>¿Seguro?</h5>
					<button
						disabled={deleting}
						className='button danger-button'
						onClick={execDelete}
					>
						{deleting ? "Borrando..." : "Borrar Definitivamente"}
					</button>
				</div>
			) : (
				<></>
			)}
		</>
	);

	const renderItem = () => {
		return (
			<div>
				<Card style={{ borderRadius: 10 }}>
					<Card.Header>
						<Card.Title as='h5'>Notificación nueva</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form onSubmit={submitChanges}>
							<Form.Row>
								<Form.Group as={Col} xs={12} xl={4}>
									<Form.Label>Tiempo de Vida en horas</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												lifetime: parseInt(
													str.currentTarget.value
												),
											});
											console.log(item!.lifetime);
										}}
										required={false}
										type='number'
										placeholder='Ingresa el tiempo de vida de la notificacion en horas. 24 horas por default.'
										value={item!.lifetime}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} xl={4}>
									{/* Notification Description*/}
									<Form.Label>Contenido Notificacion</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												descripcion:
													str.currentTarget.value,
											});
											console.log(item!.descripcion);
										}}
										required={true}
										type='text'
										placeholder='Escribe el contenido de la notificacion'
										value={item!.descripcion}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} xl={4} >
									<Form.Label>Fecha a Publicar</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												fecha: new Date(
													str.currentTarget.value
												),
											});
											console.log(item!.fecha);
										}}
										required={true}
										type='date'
										placeholder='Fecha'
									/>
								</Form.Group>
							</Form.Row>
							<button
								type='submit'
								disabled={loadingSubmit}
								className='submit-button'
								style={{ float: "right", position: "relative" }}
							>
								{loadingSubmit
									? "Cargando..."
									: "Subir Notificación"}
							</button>
						</Form>
					</Card.Body>
				</Card>
				{/* {id !== ADD_NEW_ITEM_CODE ? deleteItemButtons : <></>} */}
			</div>
		);
	};

	return renderItem();
};

export default EditForm;
