import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Card, Col, Form, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../../API/Firebase";
import { Usuario } from "../../Constants/interfaces";
import profilepicture from "../../Assets/img/profilepicture.png";
import LoginModal from "./LoginModal/index";

import "./style.css";

interface Props {
	setBreadCrumb: (val: string) => void;
	usuario: Usuario;
}

const Configuracion: FC<Props> = ({ setBreadCrumb, usuario }) => {
	// const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<Usuario>(usuario);
	const [image, setImage] = useState<File | undefined>();
	const [showModal, setShowModal] = useState<boolean>(false);
	const newPasswordRef = useRef<HTMLInputElement>(null);

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
		const imgSrc = (window.URL || window.webkitURL).createObjectURL(
			files.item(0)!
		);
		return imgSrc;
	};

	const submitChanges = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const newPassword = newPasswordRef.current!.value;
		if (user.email !== usuario.email || newPassword !== "") {
			setShowModal(true);
		} else {
			setLoadingSubmit(true);
			let message = "Se ha actualizado la información";
			try {
				const copy = user!;
				if (image !== undefined) {
					copy.imgFile = image;
				}
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
		}
	};

	const renderItem = () => {
		var imgSrc = usuario.imagen_perfil;
		var inputElement: HTMLInputElement;
		var imgElement: HTMLImageElement;
		return (
			<div>
				<LoginModal
					usuario={usuario}
					setLoadingSubmit={setLoadingSubmit}
					newUser={user}
					newPasswordRef={newPasswordRef}
					image={image}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
				<Card style={{ borderRadius: 10 }}>
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
										<input
											type='file'
											id='imgupload'
											ref={(input) =>
												(inputElement = input!)
											}
											style={{ display: "none" }}
											onChange={(event) => {
												imgSrc = saveFileLocally(
													event
												)!;
												imgElement.src = imgSrc;
											}}
										/>
										<Image
											onClick={() => {}}
											style={{
												maxWidth: "150px",
												cursor: "pointer",
											}}
											ref={(img) => {
												imgElement = img!;
											}}
											src={imgSrc}
											roundedCircle
											onClickCapture={(event) => {
												inputElement.click();
											}}
											onError={(event) =>
												(event.currentTarget.src = profilepicture)
											}
										/>
									</Form.Label>
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
										value={user!.nombre}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} xl={6}>
									<Form.Label>Correo</Form.Label>
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
										value={user!.email}
									/>
								</Form.Group>
								<Form.Group as={Col} xs={12} xl={6}>
									<Form.Label>Nueva Contraseña</Form.Label>
									<Form.Control
										required={false}
										type='password'
										placeholder='Contraseña'
										ref={newPasswordRef}
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
