import React, { FC, useContext, useRef } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../../../API/Firebase";
import { Usuario } from "../../../Constants/interfaces";

interface Props {
	usuario: Usuario;
	setLoadingSubmit: React.Dispatch<React.SetStateAction<boolean>>;
	newUser: Usuario;
	newPasswordRef: React.RefObject<HTMLInputElement>;
	image: File | undefined;
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: FC<Props> = ({
	usuario,
	setLoadingSubmit,
	newUser,
	newPasswordRef,
	image,
	showModal,
	setShowModal,
}) => {
	const firebase = useContext(FirebaseContext);
	const history = useHistory();
	const modalEmailRef = useRef<HTMLInputElement>(null);
	const modalPasswordRef = useRef<HTMLInputElement>(null);

	const submitModal = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const email = modalEmailRef.current!.value;
		const password = modalPasswordRef.current!.value;
		setLoadingSubmit(true);
		let message = "";
		firebase.getAuthUser().then((authUser) => {
			if (email !== authUser.email) {
				window.alert("Usuario incorrecto!");
				return;
			}
			firebase
				.doSignInWithEmailAndPassword(email, password)
				.then(() => {
					const newPassword = newPasswordRef.current!.value;
					setShowModal(false);
					try {
						const copy = newUser!;
						if (image !== undefined) {
							copy.imgFile = image;
						}
						if (newUser.email !== usuario.email) {
							firebase
								.changeUserEmail(newUser.email)
								.then(() => {
									firebase
										.updateUsuarioEmail(
											usuario.uid,
											newUser.email
										)
										.then(() => {
											window.alert(
												"Se modifico el correo correctamente"
											);
										})
										.catch(() => {
											window.alert(
												"Hubo un error al cambiar el correo, asegurese de que este sea valido"
											);
										});
								})
								.catch((e) => {
									window.alert(
										"Hubo un error al cambiar el correo, asegurese de que este sea valido"
									);
								});
						}
						if (newPassword !== "") {
							firebase
								.changeUserPassword(newPassword)
								.then(() => {
									window.alert(
										"Se modifico la contraseña correctamente"
									);
								})
								.catch((e) => {
									window.alert(
										"Hubo un error al cambiar la contraseña, asegurese de que tenga al menos 7 caracteres"
									);
								});
							newPasswordRef.current!.value = "";
						}
						if (newUser.nombre !== usuario.nombre) {
							firebase
								.updateUsuarioNombre(
									usuario.uid,
									newUser.nombre
								)
								.then(() => {
									window.alert(
										"Se modifico el nombre correctamente"
									);
								})
								.catch(() => {
									window.alert(
										"Hubo un error al modificar el nombre"
									);
								});
						}
					} catch (e) {
						console.log(e);
						window.alert(
							"Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet."
						);
					}
					setLoadingSubmit(false);
					history.push("/dashboard/configuracion");
				})
				.catch((err) => {
					if (err.toString().includes("password")) {
						message = "Contraseña incorrecta";
					} else {
						message = "Usuario incorrecto";
					}
					window.alert(message);
				});
		});
	};

	return (
		<Modal show={showModal}>
			<Modal.Header>
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div style={{ color: "red" }}>
					Reingrese sus datos para verificar su identidad
				</div>
				<Form id='modalForm' onSubmit={submitModal}>
					<Form.Group>
						<Form.Label>Correo: </Form.Label>
						<Form.Control type='text' ref={modalEmailRef} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Contraseña: </Form.Label>
						<Form.Control type='password' ref={modalPasswordRef} />
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => setShowModal(false)}>
					Cancelar
				</Button>
				<Button variant='primary' form='modalForm' type='submit'>
					Confirmar
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default LoginModal;
