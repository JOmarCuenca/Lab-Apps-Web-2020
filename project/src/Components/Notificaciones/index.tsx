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

	const renderFormGroup = (label: string, onChange : (s : any) => void, value?: string | number | string[], type? : string, placeholder? : string) => {

		if(type && type === "textarea")
			return <Form.Group as={Row}>
				<Form.Label as={Col} lg={12} xl={4} style={{marginBottom : 12}} >{label}</Form.Label>
				<Col lg={12} xl={8} >
					<Form.Control
						className="select"
						as="textarea"
						rows={3}
						placeholder={placeholder}
						onChange={onChange}
						value={value}
						required
					/>
				</Col>
			</Form.Group>;

		return <Form.Group as={Row}>
			<Form.Label as={Col} xs={12} xl={4} style={{marginBottom : 12}} >{label}</Form.Label>
			<Col xs={12} xl={8} >
				<Form.Control
					className="select"
					type={type}
					placeholder={placeholder}
					onChange={onChange}
					value={value}
					required
				/>
			</Col>
		</Form.Group>;
	}

	const renderItem = () => {
		return (
			<Row>
				<Col xs={12} xl={6}>
					<h4 id="notifTag">Notificación</h4>
					<div className="maindiv">
						<Form onSubmit={submitChanges}>
							{renderFormGroup(
								"Titulo",
								(target) => setItem({...item!,title : target.currentTarget.value}),
								item!.title,
								"text",
								"Titulo de la Notificacion"
							)}
							<hr className="hr1"></hr>
							{renderFormGroup(
								"Mensaje Adjunto",
								(target) => setItem({...item!,descripcion : target.currentTarget.value}),
								item!.descripcion,
								"textarea",
								"Ej. Buscar horario para meditar"
							)}
							<br />
							{renderFormGroup(
								"Fecha",
								(str) => {
									setItem({
										...item!,
										fecha: new Date(str.currentTarget.value),
									});
								},
								undefined,	
								"date"
							)}
							<hr className="hr1"></hr>
							<button type="submit" className="publicar">PUBLICAR</button>
						</Form>
					</div>
				</Col>
				<Col xl={1}>
				</Col>
				<Col xl={4} xs={12}>
					<h4 className="h">Historial</h4>
					<div id="historicalDiv" className="overflow-auto">
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
