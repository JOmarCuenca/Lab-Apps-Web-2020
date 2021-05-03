import React, { FC } from "react";
import { Coord, Evento } from "../../../Constants/interfaces";
import infoIcon from "../../../Assets/img/info.png";

import "./style.css";
import { Col, Row } from "react-bootstrap";

const EXAMPLE_IMG = "https://www.bbva.com/wp-content/uploads/2020/07/BBVA-mindfullnes-03082020-1920x1180.jpg";

interface Props {
	event       : Evento,
    openEdit    : () => void
}

const EventWidget : FC<Props> = ({event, openEdit}) => {

    const getPlace = (place : string | Coord) => {
        return "Liga Zoom";
    }

    const getImage = () : string => {
        if ( event.imgFile === undefined || (event.imgFile && typeof event.imgFile === "object")){
            return EXAMPLE_IMG;
		}
        return event.imgFile!;
    }

    return <div className="eventWidget">
        <Row>
        <Col className="disappearable" xs={3}><img src={getImage()} alt={`Event ${event.id}`} className="eventImg" /></Col>
        <Col xs={7}>
            <h3>{event.nombre}</h3>
            <h5>{getPlace(event.place)}</h5>
        </Col>
        <Col xs={2}><img src={infoIcon} alt="Info Icon" onClick={openEdit} className="infoIconBtn" /></Col>
        </Row>
    </div>;
}

export default EventWidget;