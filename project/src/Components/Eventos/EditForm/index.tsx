import React, { FC, useContext, useEffect, useState } from "react";
import { Card, Col, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../../../API/Firebase";
import { Evento } from "../../../Constants/interfaces";

import "../style.css";

const EventosForm: FC = () => {
	// const { id } = useParams<{ id: string }>();
	const [item, setItem] = useState<Evento>({
		id: "",
		descripcion: "",
		img: "",
		currentUsers: [],
		maxUsers: 100,
		fecha: new Date(),
		fecha_delete: new Date(),
		nombre: "",
		place: "",
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
			img: "",
			currentUsers: [],
			maxUsers: 100,
			fecha: new Date(),
			fecha_delete: new Date(),
			nombre: "",
			place: "",
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
		let message = "Se ha actualizado la información";
		try {
			const copy = item!;
			if (image !== undefined) {
				copy.imgFile = image;
			}
			// if(id !== ADD_NEW_ITEM_CODE) await firebase.updateProduct(copy);
			// else await firebase.saveProduct(copy);
			await firebase.setNewEvento(copy);
		} catch (e) {
			console.log(e);
			message =
				"Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet.";
		}
		setLoadingSubmit(false);
		window.alert(message);
		history.push("/dashboard/events");
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
						<Card.Title as='h5'>Información</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form onSubmit={submitChanges}>
							<Form.Row>
								{/* Titulo */}
								<Form.Group as={Col} xs={12} xl={4}>
									<Form.Label>Nombre del evento</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												nombre: str.currentTarget.value,
											});
											console.log(item!.nombre);
										}}
										required={true}
										type='text'
										placeholder='Nombre del evento'
										value={item!.nombre}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>Descripcion del evento</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												descripcion: str.currentTarget.value,
											});
										}}
										required={true}
										type='textarea'
										placeholder='Descripcion del evento'
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>Fecha del evento</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												fecha: new Date(str.currentTarget.value),
											});
										}}
										required={true}
										type='date'
										placeholder='Fecha de publicación del evento'
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>Numero máximo de usuarios</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												maxUsers: parseInt(str.currentTarget.value),
											});
										}}
										required={false}
										type='number'
										placeholder='Cantidad máximo de usuarios'
										value={item.maxUsers}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>Fecha de borrado del evento</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												fecha_delete: new Date(str.currentTarget.value),
											});
										}}
										required={true}
										type='date'
										placeholder='Fecha de borrado del evento'
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>Lugar del evento</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												place: str.currentTarget.value,
											});
										}}
										required={true}
										type='text'
										placeholder='Lugar del evento'
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>Imagen</Form.Label>
									<Form.Control
										onChange={saveFileLocally}
										required={false}
										type='file'
										placeholder='Imagen'
									/>
								</Form.Group>
							</Form.Row>
							<button
								type='submit'
								disabled={loadingSubmit}
								className='submit-button'
								style={{ float: "right", position: "relative" }}
							>
								{loadingSubmit ? "Cargando..." : "Subir Información"}
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

export default EventosForm;
