import React, { FC, useState } from "react";
import { Col, Form, Row, Button, Modal} from "react-bootstrap";
import { Notificacion } from "../../../../Constants/interfaces";

import "./style.css";

interface Props {
    child : Notificacion,
    alterScreen : (val: Notificacion) => void;
}
const NotifWidget : FC<Props> = (p) => {

    const isAlive = () : boolean => {
        const timeOfDeath = p.child.fecha.getTime() + (p.child.lifetime ?? 24) * 60 * 60 * 1000;
        const now = new Date();
        return now.getTime() < timeOfDeath;
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <div className="NotifWidget" onClick={() => p.alterScreen(p.child)}>
        <div className="divB">
            <h5 className="Child">{p.child.title}</h5>
        </div>
        <div className="divB">
            {isAlive() ? <button className="On" onClick={handleShow}>ON</button> : <></>}
            <Modal className="modalp" show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                        <Modal.Title>{p.child.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{p.child.descripcion}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary">
                        Modificar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        <div className="divB">
            <button className="X">X</button>
        </div>
        <hr></hr>
    </div>;
};

export default NotifWidget;