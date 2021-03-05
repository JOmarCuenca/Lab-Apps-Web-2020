import React, { FC, FormEvent, useContext, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { FirebaseContext } from "../../../API/Firebase";
import { Evento } from "../../../Constants/interfaces";

import "../style.css";

interface FormField {
	label 		: string,
	placeholder : string,
	xs?			: number,
	sm?			: number,
	md?			: number,
	lg?			: number,
	xl?			: number,
	controlId?	: string,
	onChange? 	: ((event: React.ChangeEvent) => void),
	type? 		: string,
	value? 		: string | number | string[],
	required?	: boolean
}

const EditForm: FC = () => {

	// const { id } = useParams<{ id: string }>();
	const [item, setItem] = useState<Evento>(
		{
			id : "",
			descripcion : "",
			img : "",
			currentUsers : [],
			maxUsers : 100,
			fecha : new Date(),
			fecha_delete : new Date(),
			nombre : "HBD",
			place : "My house"				
		}
	);
	const [image, setImage] = useState<File | undefined>();
	const [deleteItem, setDeleteItem] = useState<boolean>(false);

	const [loadingSubmit,setLoadingSubmit] = useState<boolean>(false);
	const [deleting,setDeleting] = useState<boolean>(false);
	const [changeImage,setChangeImage] = useState<boolean>(false);

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
				id : "",
				descripcion : "",
				img : "",
				currentUsers : [],
				maxUsers : 100,
				fecha : new Date(),
				fecha_delete : new Date(),
				nombre : "HBD",
				place : "My house"				
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
		if (image !== undefined && image !== null){
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
	}

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
			console.log(copy);
		} catch (e) {
			console.log(e);
			message = "Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet."
		}
		setLoadingSubmit(false);
		window.alert(message);
		history.push("/dashboard/notifications");
	}

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
	}

	const createFormField = (formField : FormField) => 
	<Form.Group as={Col} xs={formField.xs} sm={formField.sm} md={formField.md} lg={formField.lg} xl={formField.xl} controlId={formField.controlId}>
		<Form.Label>{formField.label}</Form.Label>
		{(formField.type === "textarea") ? 
			<Form.Control
				as="textarea"
				rows={3}
				onChange={formField.onChange}
				required={formField.required ?? false}
				type={formField.type}
				placeholder={formField.placeholder}
				value={formField.value}
			/> : 
			<Form.Control
				onChange={formField.onChange}
				required={formField.required ?? false}
				type={formField.type}
				placeholder={formField.placeholder}
				value={formField.value}
			/>
		}
		{/* <Form.Control.Feedback>{looksGoodMessage}</Form.Control.Feedback> */}
	</Form.Group>;

	const deleteItemButtons = <>
		<button disabled={deleting} className="button warning-button" onClick={() => setDeleteItem(true)} >{deleting ? "Borrando..." :"Borrar Producto"}</button>
		{deleteItem ? <div style={{ paddingTop: "10px" }} ><h5>¿Seguro?</h5><button disabled={deleting} className="button danger-button" onClick={execDelete} >{deleting ? "Borrando..." :"Borrar Definitivamente"}</button></div> : <></>}
	</>;

	const renderItem = () => {

		return <div>
			<Card style={{ borderRadius: 10 }}>
				<Card.Header><Card.Title as="h5">Información</Card.Title></Card.Header>
				<Card.Body>
					<Form onSubmit={submitChanges} >
						<Form.Row>
							{/* Titulo */}
							<Form.Control
								onChange={(str) => {setItem({...item!,nombre : str.currentTarget.value});console.log(item!.nombre)}}
								required={true}
								type="text"
								placeholder="Nombre del evento"
								value={item!.nombre}
							/>
						</Form.Row>
						<Form.Row>
							{createFormField({
								label 		: "Fecha de publicacion en la app",
								sm			: 12,
								md			: 4,
								placeholder	: "Stuff",
								type		: "date",								
							})}
						</Form.Row>
						<Form.Row>
							{/* Notification Description*/}
							{createFormField({
								type		: "textarea",
								placeholder	: "Here Comes the Body of the notification if you want to know more.",
								required	: true,
								label		:"Descripcion",
								controlId 	: "description",
								md 			: 8
							})}
						</Form.Row>
						<button type="submit" disabled={loadingSubmit} className="submit-button" style={{float:"right",position:"relative"}}  >
							{loadingSubmit ? "Cargando..." : "Subir Información"}
						</button>
					</Form>
				</Card.Body>
			</Card>
			<Card style={{ borderRadius: 10 }}>
				<Card.Header>
					<Card.Title as="h5">Imagen del evento</Card.Title>
					<Card.Subtitle style={{ paddingTop: "20px" }}>
						<Row>
							<Col xs="6"><input type="file" onChange={saveFileLocally} /></Col>
								<Col xs="6"><button disabled={image === undefined || changeImage} className="submit-button" onClick={changeOnlyImage} style={{ position: "absolute", right: "50" }} >{changeImage ? "Cargando Imagen..." : "Subir y Cambiar Imagen"}</button></Col>
						</Row>
					</Card.Subtitle>
				</Card.Header>
				{/* <Card.Body>{product.imageURL === "" ? CONFUSED_TRAVOLTA : <img alt="productImg" style={{maxWidth : "100%"}} src={product.imageURL} />}</Card.Body> */}
			</Card>
			{/* {id !== ADD_NEW_ITEM_CODE ? deleteItemButtons : <></>} */}
		</div>;
	}


	return renderItem();

};

export default EditForm;