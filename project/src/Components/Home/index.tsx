import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { FirebaseContext } from "../../API/Firebase";
import { Evento, Usuario } from "../../Constants/interfaces";
import ClockTime from "./Clock";
import EventWidget from "./EventWidget";
import NotificationWidget from "./NotificationWidget";

import "./style.css";

interface Props {
	user : Usuario
}

const HomeScreen: React.FC<Props> = (p) => {

	const BORDER_RADIUS = 16;

	const firebase = useContext(FirebaseContext);
	
	const [loaded, setLoaded] = useState(false);
	const [recentEvents,setRecentEvents] = useState<Evento[]>([]);

	useEffect(() => {
		// load from API las 2 events
		firebase.getLimitedEvento(2,0)
		.then((events) => setRecentEvents(events))
		.catch((e) => console.log(e))
		.finally(() => setLoaded(true));
		// eslint-disable-next-line
	}, []);

	/**
	 * 
	 * @returns String Formated in Spanish for the date.
	 */
	const getToday = () => Intl.DateTimeFormat("es", { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

	/**
	 * @returns Greeting apropiate for the time of the day.
	 */
	const getGreeting = () => {
		const hourNow = new Date();
		let result = "¡";
		if(hourNow.getHours() > 18 || hourNow.getHours() < 6){
			result += "Buenas noches, ";
		} else if(hourNow.getHours() > 11){
			result += "Buenas tardes, ";
		} else {
			result += "Buenas dias, ";
		}
		return result+p.user.nombre+"!";
	}

	const loadingScreen = () => {
		return <div id="spinnerCenter">
			<Spinner animation="border" variant="info" />
		</div>;
	}

	const loadedScreen = () => {
		return <Row>
			<Col xs={12}>
				<Card className="whitePersonalCard" style={{ borderRadius: BORDER_RADIUS }}>
					<Card.Body>
						<Row>
							<Col md={12} lg={6} >
								<div id="greeting">{getGreeting()}</div>
							</Col>
							<Col md={12} lg={1} >
								<div id="weatherIcon"><img className="dayTime" src="https://www.sunny.pet/wp-content/uploads/2016/08/sunny-articulos-para-mascota-sol.jpg" alt="sunny" /></div>
							</Col>
							<Col md={12} lg={5} >
								<div id="clockZone">
									<Row>
										<Col xs={12}><div id="clock"><ClockTime /></div></Col>
										<Col xs={12}>{getToday()}</Col>
									</Row>
								</div>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Col>
			<Col xs={12} md={6}>
				<Card className="personalCard" style={{ borderRadius: BORDER_RADIUS }}>
					<Card.Header>
						<h4>Ultimos Eventos</h4>
					</Card.Header>
					<Card.Body >
						{/* <img height="300px" src="https://thumbs.gfycat.com/AccurateUnfinishedBergerpicard-size_restricted.gif" alt="travolta" /> */}
						{/* <h1>De momento no hay eventos...</h1> */}

					{recentEvents === undefined || recentEvents.length === 0 ? <p></p> : 
						<Row>
							{recentEvents.map((e) => {
								return <Col xs={12}>
									<EventWidget event={e}/>
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
			<Col xs={12} md={6}>
				<Row>
					<Col md={12}>
						<Card className="personalCard" style={{ borderRadius: BORDER_RADIUS }}>
							<Card.Body>
								<Row style={{textAlign: 'center', fontSize: '40px'}}>
									<Col xs={5}><h3>USUARIOS ACTIVOS</h3></Col>
									<Col xs={2}><hr className="verticalHr" /></Col>
									<Col xs={5}><h3>50</h3></Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
					<Col md={12}>
						<Card className="personalCard" style={{ borderRadius: BORDER_RADIUS }}>
							<Card.Header>
								<h6>Ultimas Notificaciones</h6>
							</Card.Header>
							<Card.Body >
								{/* <img height="300px" src="https://thumbs.gfycat.com/AccurateUnfinishedBergerpicard-size_restricted.gif" alt="travolta" /> */}
								{/* <h3>De momento no hay notificaciones...</h3> */}
								<Row>
									<Col xs={12}>
										<NotificationWidget notification={{
											id : "someId",
											descripcion : "Some Text",
											fecha : new Date(),
											title : "The Title"
										}}/>
									</Col>
									<Col xs={12}>
										<NotificationWidget notification={{
											id : "someId",
											descripcion : "Some Text",
											fecha : new Date(),
											title : "The Title"
										}}/>
									</Col>
									<Col xs={12}>
										<div className="expanded">
											<h1 className="moreEventsBtn">...</h1>
										</div>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Col>
		</Row>;
	}

	return (!loaded) ? loadingScreen() : loadedScreen();
};

export default HomeScreen;
