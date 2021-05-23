import React, { FC, useContext, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FirebaseContext } from "../../API/Firebase";
import { Notificacion } from "../../Constants/interfaces";
import NotifWidget from "./NotifTile";

import "./style.css";

var a = 1;
var deleteInSearch = 1;

const NotificationForm: FC = () => {

	const [item, setItem] = useState<Notificacion>({
		id: "",
		title : "",
		descripcion: "",
		fecha: new Date(),
		lifetime: 24,
	});
	const [historyNotif, sethistoryNotif] = useState<Notificacion[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [historyNotifC, sethistoryNotifC] = useState<Notificacion[]>([]);

	const firebase = useContext(FirebaseContext);

	useEffect(() => {
		setItem({
			id: "",
			title : "",
			descripcion: "",
			fecha: new Date(),
			lifetime: 24,
		});
		getRemoteNotifications();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if(searchTerm === "" && a === 1){
			a = 0;
			sethistoryNotif(historyNotifC);
		}
		sethistoryNotif(historyNotifC.filter((val) => {
			deleteInSearch = 0;
			return (val.title.toLowerCase().includes(searchTerm.toLowerCase()));
		}));
		a = 1;
		// eslint-disable-next-line
	}, [searchTerm]);

	function getRemoteNotifications(){
		firebase.getAllNotifications().then((notifications) => {
			const orderedNotifs = notifications.sort((a,b) => b.fecha.getTime() - a.fecha.getTime());
			sethistoryNotifC(orderedNotifs);
			sethistoryNotif(orderedNotifs);
		});
	}

	const submitChanges = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let message = "Se ha subido la notificación";
		let failure = false;
		const copy = item!;
		try {
			copy.id = await firebase.setNewNotificacion(copy);
		} catch (e) {
			console.log(e);
			failure = true;
			message =
				"Ha ocurrido un error, revise que toda la información sea correcta,\nY que tiene buena conexión de internet.";
		}
		window.alert(message);
		if(!failure){
			sethistoryNotif([
				copy,
				...historyNotif
			]);
			sethistoryNotifC([
				copy,
				...historyNotif
			])
			setItem({
				id: "",
				title : "",
				descripcion: "",
				fecha: new Date(),
				lifetime: 24
			});
		}
		// window.location.reload();
	};
	
	const deleteFromList = (index : number) => {
        const copy = Array.from(historyNotif);
        copy.splice(index, 1);
        sethistoryNotif(copy);
		sethistoryNotifC(copy);
		if(deleteInSearch === 0){
			getRemoteNotifications();
			setSearchTerm("");
			(document.getElementById("searchInput") as HTMLInputElement).value = "";
			deleteInSearch = 1;
		}
    }

	const renderItem = () => {
		return (
			<Row>
				<Col xl={6} xs={12}>
					<h4 className="usuario">Notificación</h4>
				<div className="maindiv">
                    <Form onSubmit={submitChanges}>
                        <p className="parrafo" id="titulo">Titulo</p>
                        <Form.Control
							className="select"
							type="text"
							placeholder="Titulo de la Notificacion"
							onChange={(target) => setItem({...item!,title : target.currentTarget.value})}
							value={item!.title}
						/>
                        <hr className="hr1"></hr>
                        <p className="parrafo" id="mensaje">Mensaje Adjuntado</p>
                        <Form.Control
							className="select"
							as="textarea"
							placeholder="Ej. Traer sus propios alimentos"
							rows={3}
							onChange={(target) => setItem({...item!,descripcion : target.currentTarget.value})}
							value={item!.descripcion}
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
                        <hr className="hr1"></hr>
						<button type="submit" className="publicar">PUBLICAR</button>
					</Form>
            	</div>
				</Col>
				<Col xl={1}>
				</Col>
				<Col xl={4} xs={12}>
					<h4 className="h">Historial</h4>
					<div className="maindiv1 overflow-auto">
						<input 
							type="text" 
							id = "searchInput"
							placeholder="Buscar..." 
							onChange={event => 
								{setSearchTerm(event.target.value)
							}}
						/>
						{historyNotif.map( (n, i) => <NotifWidget key={`notification_${i}`} index={i} child={n} alterScreen={setItem} deleteFromList={deleteFromList} />)}
						
					</div>
				</Col>
			</Row>
		);
	};

	return renderItem();
};

export default NotificationForm;
