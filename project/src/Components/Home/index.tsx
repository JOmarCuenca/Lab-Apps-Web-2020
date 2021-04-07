import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import ClockTime from "./Clock";
import EventWidget from "./EventWidget";

import "./style.css";

interface Props {
	setBreadCrumb: (val: string) => void;
}
const HomeScreen: React.FC<Props> = ({ setBreadCrumb }) => {

	const BORDER_RADIUS = 16;
	
	const [loaded, setLoaded] = useState(false);
	const [user]	 = useState("Usuario");

	useEffect(() => {
		setLoaded(true);
		setBreadCrumb("");
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
		return result+user+"!";
	}

	const loadingScreen = () => {
		return <div>
			<h1>Loading...</h1>
		</div>;
	}

	const loadedScreen = () => {
		return <Row>
			<Col xs={12}>
				<Card className="whitePersonalCard" style={{ borderRadius: BORDER_RADIUS }}>
					<Card.Body>
						<Row>
							<Col md={12} lg={6} style={{textAlign: 'center', margin: "20px auto"}} >
								<h1>{getGreeting()}</h1>
							</Col>
							<Col md={12} lg={1} >
								<img className="dayTime" src="https://www.sunny.pet/wp-content/uploads/2016/08/sunny-articulos-para-mascota-sol.jpg" alt="sunny" />
							</Col>
							<Col md={12} lg={5} >
								<Row style={{textAlign: 'center', fontSize: '40px'}}>
									<Col xs={12}><ClockTime /></Col>
									<Col xs={12}><h3>{getToday()}</h3></Col>
								</Row>
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
						<Row>
							<Col xs={12}>
								<EventWidget event={{
									id              : "infinite Power!!!!",
									nombre          : "Somebody",
									descripcion     : "some... body",
									fecha           : new Date(),
									fecha_delete    : new Date(),
									img             : "some link",
									place           : "some Link",
									maxUsers        : 100,
									currentUsers    : []}
								} />
							</Col>
							<Col xs={12}>
								<EventWidget event={{
									id              : "infinite Power!!!!",
									nombre          : "Once Told Me..",
									descripcion     : "some... body",
									fecha           : new Date(),
									fecha_delete    : new Date(),
									img             : "some link",
									place           : "some Link",
									maxUsers        : 100,
									currentUsers    : []}
								} />
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
								<h3>De momento no hay notificaciones...</h3>
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
