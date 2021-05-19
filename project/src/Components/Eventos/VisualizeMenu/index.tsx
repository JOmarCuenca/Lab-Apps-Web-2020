import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ADD_NEW_ITEM_CODE } from "../../../Constants/constants";
import { FirebaseContext } from "../../../API/Firebase";
import { Evento } from "../../../Constants/interfaces";
import EventContainer from "../../EventContainer";

const EVENT_INCREASE_RATE = 4;

const EventosMenu: React.FC = () => {
	const firebase          				= useContext(FirebaseContext);
	const history 							= useHistory();
	const [recentEvents,setRecentEvents]    = useState<Evento[]>([]);
	const [numEvents,setNumEvents]			= useState(EVENT_INCREASE_RATE);

	useEffect(() => {
		firebase.getLimitedEvento(numEvents)
		.then((events) => setRecentEvents(events))
		.catch(err => console.log(err));
		// eslint-disable-next-line
	}, [numEvents]);

	function askForMoreEvents(){
		if(recentEvents.length >= numEvents){
			setNumEvents(numEvents + EVENT_INCREASE_RATE);
		}
	}

	const moreEventsBtn = (recentEvents.length >= numEvents) ?
		<Col xs={12}>
			<div className="expanded">
				<h1 className="moreEventsBtn" onClick={askForMoreEvents} >...</h1>
			</div>
		</Col> :
		<></>;

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
							{moreEventsBtn}
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
