import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ADD_NEW_ITEM_CODE } from "../../../Constants/constants";
import { FirebaseContext } from "../../../API/Firebase";

import "../style.css";
import { Evento } from "../../../Constants/interfaces";

interface Props {
	setBreadCrumb: (val: string) => void;
}
const EventosMenu: React.FC<Props> = ({ setBreadCrumb }) => {
	const firebase          				= useContext(FirebaseContext);
	const history 							= useHistory();
	const [events,setEvents] 				= useState<Evento[]>([]);
	// const [changeStatus, setChangeStatus] 	= useState("");

	useEffect(() => {
		setBreadCrumb("Eventos");
		firebase.getAllEventos().then(dbEvents => {
			setEvents(dbEvents);
			console.log(dbEvents);
		});
		// eslint-disable-next-line
	}, []);

	// useEffect(() => {
	// 	if (changeStatus !== "") {
	// 		// firebase.getProducts().then(menu => setMenu(menu)).catch(e => {
	// 		//     console.log(e);
	// 		//     setMenu([]);
	// 		// }).finally(() => setChangeStatus(""));
	// 	}
	// 	// eslint-disable-next-line
	// }, [changeStatus]);

	return (
		<Row>
			<Col style={{ paddingBottom: "20px" }} xs='12'>
				<button
					className='submit-button'
					style={{ float: "right" }}
					onClick={() =>
						history.push(`/dashboard/events/${ADD_NEW_ITEM_CODE}`)
					}
				>
					Nuevo Evento
				</button>
			</Col>
			<Col xs='12'>
				<Card style={{ borderRadius: 10 }}>
					<Card.Header>
						<Card.Title as='h5'>Eventos en el Menu</Card.Title>
					</Card.Header>
					{/* <EventsTable rows={events} setter={setChangeStatus} /> */}
					{/* <EventsTable rows={events} /> */}
				</Card>
			</Col>
		</Row>
	);
};

export default EventosMenu;
