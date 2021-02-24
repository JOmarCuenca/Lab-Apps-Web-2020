import React, { FC, useContext, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
// import { FirebaseContext } from "../../../API/Firebase";
// import { Product } from "../../../Constants/interfaces";
// import { ADD_NEW_ITEM_CODE, CONFUSED_TRAVOLTA } from "../../../Constants/values";

import "../style.css";

const EditForm: FC = () => {

	const { id } = useParams<{ id: string }>();
	// const [item, setNItem] = useState<Product>();
	const [image, setImage] = useState<File | undefined>();
	const [deleteItem, setDeleteItem] = useState<boolean>(false);

	const [loadingSubmit,setLoadingSubmit] = useState<boolean>(false);
	const [deleting,setDeleting] = useState<boolean>(false);
	const [changeImage,setChangeImage] = useState<boolean>(false);

	// const firebase = useContext(FirebaseContext);
	const history = useHistory();

	useEffect(() => {
		// if(id !== ADD_NEW_ITEM_CODE){
		// 	firebase.getProductFromId("Products/"+id).then(product => setNItem(product)).catch(e => {
		// 		console.log(e);
		// 		window.alert("This item appears to be non-existant");
		// 		history.push("/dashboard/menu");
		// 	});
		// } else {
		// 	setNItem({
		// 		averageWeight : 0,
		// 		description : "",
		// 		id : "",
		// 		imageURL : "",
		// 		name : "",
		// 		price : 0,
		// 		active : true
		// 	});
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
		// if(id === ADD_NEW_ITEM_CODE && (image === undefined || item!.imageURL === "")){
		// 	window.alert("Cuando se agrega un nuevo producto, es necesario subir una imagen con este.");
		// 	setLoadingSubmit(false);
		// 	return;
		// }
		let message = "Se ha actualizado la información";
		try {
			// const copy = item!;
			// if (image !== undefined) {
			// 	copy.imageURL = await firebase.uploadImage(image);
			// }
			// if(id !== ADD_NEW_ITEM_CODE) await firebase.updateProduct(copy);
			// else await firebase.saveProduct(copy);
			// console.log(copy);
		} catch (e) {
			console.log(e);
			message = "Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet."
		}
		setLoadingSubmit(false);
		window.alert(message);
		// if(id === ADD_NEW_ITEM_CODE) history.push("/dashboard/menu");
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

	const deleteItemButtons = <>
		<button disabled={deleting} className="button warning-button" onClick={() => setDeleteItem(true)} >{deleting ? "Borrando..." :"Borrar Producto"}</button>
		{deleteItem ? <div style={{ paddingTop: "10px" }} ><h5>¿Seguro?</h5><button disabled={deleting} className="button danger-button" onClick={execDelete} >{deleting ? "Borrando..." :"Borrar Definitivamente"}</button></div> : <></>}
	</>;

	const renderItem = () => {

		return <div>
			<Card style={{ borderRadius: 10 }}>
				<Card.Header><Card.Title as="h5">Información Producto</Card.Title></Card.Header>
				<Card.Body>
					<Form onSubmit={submitChanges} >
						<Form.Row>
							<Form.Group as={Col} md="5" controlId="nombre">
								<Form.Label>Nombre</Form.Label>
								<Form.Control
									// onChange={(str) => setNItem({
									// 	...product,
									// 	name: str.target.value ?? "",
									// })}
									required
									type="text"
									placeholder="Ej. Pozole Verde"
									// value={product.name}
								/>
								{/* <Form.Control.Feedback>{looksGoodMessage}</Form.Control.Feedback> */}
							</Form.Group>
						</Form.Row>
						<Form.Row>
							{/* Price */}
							<Form.Group as={Col} md={4} controlId="precio">
								<Form.Label>Precio (MXN)</Form.Label>
								<Form.Control
									// onChange={(str) => setNItem({
									// 	...product,
									// 	price: parseFloat(parseFloat(str.target.value).toFixed(2)) ?? 0.0,
									// })}
									required
									type="number"
									placeholder="100.00"
									// value={product.price}
								/>
								{/* <Form.Control.Feedback>{looksGoodMessage}</Form.Control.Feedback> */}
							</Form.Group>
							{/* Discount */}
							<Form.Group as={Col} md={4} controlId="descuento">
								<Form.Label>Descuento</Form.Label>
								<Form.Control
									type="number"
									placeholder="Ej. 10 (%)"
									// onChange={(str) => setNItem({
									// 	...product,
									// 	discount: parseFloat(parseFloat(str.target.value).toFixed(2)) ?? 0,
									// })}
									// value={product.discount !== undefined ? product.discount:""}
								/>
							</Form.Group>
							{/* Average Weight of the Product */}
							<Form.Group as={Col} md={4} controlId="descuento">
								<Form.Label>Peso Promedio en Kilos</Form.Label>
								<Form.Control
									type="number"
									placeholder="Ej. .5 (Kg)"
									required
									// onChange={(str) => setNItem({
									// 	...product,
									// 	averageWeight: parseFloat(parseFloat(str.target.value).toFixed(2)) ?? 0.0,
									// })}
									// value={product.averageWeight}
								/>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							{/* Product Description*/}
							<Form.Group as={Col} md="8" controlId="description">
								<Form.Label>Descripción</Form.Label>
								<Form.Control
									as="textarea"
									placeholder="Ej. Rico pozole hecho con todo el sabor de México"
									rows={3}
									required
									// value={product.description}
									// onChange={(str) => setNItem({
									// 	...product,
									// 	description : str.target.value
									// })}
								>
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<button type="submit" disabled={loadingSubmit} className="submit-button" style={{float:"right",position:"relative"}}  >
							{loadingSubmit ? "Cargando..." : "Subir Información"}
						</button>
					</Form>
				</Card.Body>
			</Card>
			<Card style={{ borderRadius: 10 }}>
				<Card.Header>
					<Card.Title as="h5">Imagen del producto</Card.Title>
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