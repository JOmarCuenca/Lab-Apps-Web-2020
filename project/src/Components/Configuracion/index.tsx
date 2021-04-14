import { fireEvent } from "@testing-library/dom";
import React, { FC, useContext, useEffect, useState } from "react";
import { Card, Col, Form, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../../API/Firebase";
import { Usuario } from "../../Constants/interfaces";
import profilepicture from "../../Assets/img/profilepicture.png";

import "./style.css";

interface Props {
	setBreadCrumb: (val: string) => void;
	usuario: Usuario;
}

const Configuracion: FC<Props> = ({ setBreadCrumb, usuario }) => {
	// const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<Usuario>(usuario);
	const [image, setImage] = useState<File | undefined>();

	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const firebase = useContext(FirebaseContext);
	const history = useHistory();

	useEffect(() => {
		setBreadCrumb("Configuración");
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

	const submitChanges = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoadingSubmit(true);
		let message = "Se ha actualizado la información";
		try {
			const copy = user!;
			if (image !== undefined) {
				copy.imagen_perfil = image;
			}
			// if(id !== ADD_NEW_ITEM_CODE) await firebase.updateProduct(copy);
			// else await firebase.saveProduct(copy);
			await firebase.updateUsuario(copy);
			console.log(copy);
		} catch (e) {
			console.log(e);
			message =
				"Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet.";
		}
		setLoadingSubmit(false);
		window.alert(message);
		history.push("/dashboard/configuracion");
	};

	const renderItem = () => {
		var imgSrc =
			typeof usuario.imagen_perfil === "string"
				? usuario.imagen_perfil
				: profilepicture;
		return (
			<div>
				<Card style={{ borderRadius: 10 }}>
					<Card.Header>
						<Card.Title as='h5'>Información</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form onSubmit={submitChanges}>
							<Form.Row
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Form.Group as={Col} xs='auto'>
									<Form.Label
										as={Col}
										xs={12}
										md={12}
										xl={12}
									>
										Imagen de perfil
									</Form.Label>
									<Image
										onClick={() => {}}
										style={{ maxWidth: "150px" }}
										src={imgSrc}
										roundedCircle
										onError={(event) =>
											(event.currentTarget.src = profilepicture)
										}
									/>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								{/* Nombre */}
								<Form.Group as={Col} xs={12} xl={6}>
									<Form.Label>Nombre</Form.Label>
									<Form.Control
										onChange={(str) => {
											setUser({
												...user!,
												nombre: str.currentTarget.value,
											});
										}}
										required={true}
										type='text'
										placeholder='Nombre'
										value={usuario!.nombre}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} xl={6}>
									<Form.Label>email</Form.Label>
									<Form.Control
										onChange={(str) => {
											setUser({
												...user!,
												email: str.currentTarget.value,
											});
										}}
										required={true}
										type='text'
										placeholder='Email'
										value={usuario!.email}
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
									: "Actualizar Usuario"}
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

export default Configuracion;
