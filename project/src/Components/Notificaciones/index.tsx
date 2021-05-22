import React, { FC, useContext, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FirebaseContext } from "../../API/Firebase";
import { Notificacion } from "../../Constants/interfaces";
import NotifWidget from "./NotifTile";

import "./style.css";

const NOTIFS_INCREASE_RATE = 4;
var a = 1;
var deleteInSearch = 1;

const NotificationForm: FC = () => {
	// const { id } = useParams<{ id: string }>();
	const [item, setItem] = useState<Notificacion>({
		id: "",
		title : "",
		descripcion: "",
		fecha: new Date(),
		lifetime: 24,
	});
	const [historyNotif, sethistoryNotif] = useState<Notificacion[]>([]);
	const [notifsToShow, setNotifsToShow] = useState(NOTIFS_INCREASE_RATE);
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
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		/*firebase.getLimitedNotification(notifsToShow, historyNotif.length)
		.then((notifications) => sethistoryNotif(notifications));*/
		firebase.getAllNotifications().then((notifications) => sethistoryNotif(notifications));
		firebase.getAllNotifications().then((notifications) => sethistoryNotifC(notifications));
		// eslint-disable-next-line
	}, []);


	useEffect(() => {
		sethistoryNotif((historyNotif) => {return historyNotifC.filter((val) => {
			if(searchTerm == "" && a == 1){
				console.log("A");
				a = 0;
				return historyNotifC;
			}
			else if(val.title.toLowerCase().includes(searchTerm.toLowerCase())){
				console.log("B");
				deleteInSearch = 0;
				return val;
			}
		})})
		a = 1;
	}, [searchTerm]);

	const submitChanges = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let message = "Se ha subido la notificación";
		let failure = false;
		const copy = item!;
		try {
			await firebase.setNewNotificacion(copy);
			console.log(copy);
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
			setItem({
				id: "",
				title : "",
				descripcion: "",
				fecha: new Date(),
				lifetime: 24
			});
		}
	};
	
	const deleteFromList = (index : number) => {
        const copy = Array.from(historyNotif);
        copy.splice(index, 1);
        sethistoryNotif(copy);
		if(deleteInSearch == 0){
			firebase.getAllNotifications().then((notifications) => sethistoryNotif(notifications))
			setSearchTerm("");
			(document.getElementById("searchInput") as HTMLInputElement).value = "";
		}
    }

	/*const cargarMas = () => {
        if(historyNotif.length >= notifsToShow){
			setNotifsToShow(notifsToShow + NOTIFS_INCREASE_RATE);
		}
    }

	const createFooter = (historyNotif.length >= notifsToShow) ?
	<footer className="expanded">
		<h1 className="moreEventsBtn" onClick={cargarMas}>
			...
		</h1>
	</footer> :
	<></>;*/

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
