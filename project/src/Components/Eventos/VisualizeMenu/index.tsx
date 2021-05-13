import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ADD_NEW_ITEM_CODE } from "../../../Constants/constants";
import { FirebaseContext } from "../../../API/Firebase";
import { Evento } from "../../../Constants/interfaces";
import EventContainer from "../../EventContainer";

const EventosMenu: React.FC = () => {
	const firebase          				= useContext(FirebaseContext);
	const history 							= useHistory();
	const [recentEvents,setRecentEvents]    = useState<Evento[]>([]);
	// const [changeStatus, setChangeStatus] 	= useState("");

	useEffect(() => {
		firebase.getAllEventos().then(dbEvents => {
			setRecentEvents(dbEvents);
		});
		// eslint-disable-next-line
	}, []);


    const renderItem = () => {
	return (
		<Row>
			<Col xs={12}>
				<Card className="whitePersonalCard" style={{ borderRadius: 16 }}>
					<Card.Header>
						<h4>Ultimos Eventos</h4>
					</Card.Header>
					<Card.Body >

					{recentEvents === undefined || recentEvents.length === 0 ? <p></p> : 
						<Row>
							{recentEvents.map((e,i) => {
								return <Col lg={12} xl={6} key={`event_${i}`} >
									<EventContainer event={e}/>
								</Col>;
							})}
							<Col xs={12}>
								<div className="expanded">
									<h1 className="moreEventsBtn"><a href="/dashboard/events">...</a></h1>
								</div>
							</Col>
						</Row>
					}
					</Card.Body>
				</Card>
			</Col>
			<Col style={{ paddingBottom: "20px" }} xs='12'>
				<button
					onClick={() =>
						history.push(`/dashboard/events/${ADD_NEW_ITEM_CODE}`)
					}
				>
					Nuevo Evento
				</button>
			</Col>
			<Row>
			
		</Row>
	</Row>
		
	);

 };

	return renderItem();
};

export default EventosMenu;
