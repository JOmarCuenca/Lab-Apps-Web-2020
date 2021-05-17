import React, { FC, useContext, useEffect, useState } from "react";
import { Card, Col, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../../../API/Firebase";
import { formatDateString, formatStringDate } from "../../../Constants/functions";
import { Coord, Evento } from "../../../Constants/interfaces";

import "../style.css";

interface Props {
	event? : Evento
}

const EventosForm: FC<Props> = ({event}) => {
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

	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const firebase = useContext(FirebaseContext);
	const history = useHistory();

	useEffect(() => {
		if(event) {
			setItem(event);
		    console.log(event);
		}
		else
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

	const interpretCoord = ( p : Coord | string ) => {
		if( typeof p === "string" ) return p

		else return `${p.latitude},${p.longitude}`;

	}

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

	const submitChanges = async (eventR: React.FormEvent<HTMLFormElement>) => {
		eventR.preventDefault();
		setLoadingSubmit(true);
		let message = "Se ha actualizado la información";
		try {
			const copy = item!;
			if (image !== undefined) {
				copy.imgFile = image;
			}
			if (event){
				copy.id = event.id;
				await firebase.updateEvento(copy)
			}
			else await firebase.setNewEvento(copy);
			
		} catch (e) {
			console.log(e);
			message =
				"Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet.";
		}

		setLoadingSubmit(false);
		window.alert(message);
		history.push("/dashboard/events");
	};

	const renderImgPreview = () => {
		if(item.imgFile && typeof item.imgFile === "string" && item.imgFile !== ""){
			return <img src={item.imgFile} id="imagePreview" alt="eventImg" />;
		}
		return <></>;
	}

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
									<Form.Label>
										Descripcion del evento
									</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												descripcion:
													str.currentTarget.value,
											});
										}}
										required={true}
										type='textarea'
										placeholder='Descripcion del evento'
										value={item!.descripcion}
										
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>Fecha del evento</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												fecha: formatStringDate(str.currentTarget.value),
											});
										}}
										required={true}
										value = {formatDateString(item!.fecha)}
	
										type='date'
										placeholder='Fecha de publicación del evento'
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>
										Numero máximo de usuarios
									</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												maxUsers: parseInt(
													str.currentTarget.value
												),
											});
										}}
										required={false}
										type='number'
										placeholder='Cantidad máximo de usuarios'
										value={item.maxUsers}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} md={8} xl={4}>
									<Form.Label>
										Fecha de borrado del evento
									</Form.Label>
									<Form.Control
										onChange={(str) => {
											setItem({
												...item!,
												fecha_delete: formatStringDate(str.currentTarget.value),
											});
										}}
										required={true}
										type='date'
										placeholder='Fecha de borrado del evento'
										value = {formatDateString(item!.fecha_delete)}
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
										value = {interpretCoord(item!.place)}
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
							{renderImgPreview()}
							<button
								type='submit'
								disabled={loadingSubmit}
								className='submit-button'
								style={{ float: "right", position: "relative" }}
							>
								{loadingSubmit
									? "Cargando..."
									: "Subir Información"}
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
