import { TextareaAutosize } from "@material-ui/core";
import firebase from "firebase";
import React, { FC, useState,  useContext} from "react";
import { FirebaseContext } from "../../../../API/Firebase";
import { Col, Form, Row, Button, Modal} from "react-bootstrap";
import { Notificacion } from "../../../../Constants/interfaces";

import "./style.css";

interface Props {
    child : Notificacion,
    index : number,
    deleteFromList : (i: number) => void,
    alterScreen : (val: Notificacion) => void;
}
const NotifWidget : FC<Props> = (p) => {

    const firebase = useContext(FirebaseContext);

    const isAlive = () : boolean => {
        const timeOfDeath = p.child.fecha.getTime() + (p.child.lifetime ?? 24) * 60 * 60 * 1000;
        const now = new Date();
        return now.getTime() < timeOfDeath;
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show1, setShow1] = useState(false);
    const handleShow1 = () => setShow1(true);

    const deleteNot = () => {
        firebase.deleteNotificacionById(p.child.id).then(() =>{
            p.deleteFromList(p.index);
        });
    }

    const handleClose1 = () => {
        var valorDesc = String($("#descNot").val());
        var valorTitulo = String($("#tituloNot").val());
        p.child.title = valorTitulo;
        p.child.descripcion = valorDesc;
        firebase.updateNotificacion(p.child);
        setShow1(false);
    } 

    return <li className="NotifWidget" id="list">
        <Row>
        <Col xs={4}>
        <div className="divB">
            <h5 className="Child">{p.child.title}</h5>
        </div>
        </Col>
        <Col xs={8}>
            {isAlive() ? 
                <div className="divB">
                    <button className="On">ON</button>
                </div>  : <></>
            }
        <div className="divB">
            <button className="Info" onClick={handleShow}>Info</button>
            <Modal className="modalp" show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                        <Modal.Title>{p.child.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{p.child.descripcion}</Modal.Body>
                <Modal.Footer>
                    {isAlive() ? <Button variant="secondary" onClick={handleShow1}>Modificar</Button> : <></>}
                    <Modal className="modalp" show={show1} onHide={handleClose1} backdrop="static">
                        <Modal.Header closeButton>
                                <textarea className="tituloNot" id="tituloNot">{p.child.title}</textarea>
                        </Modal.Header>
                        <Modal.Body>
                            <textarea className="descNot" id="descNot" >{p.child.descripcion}</textarea>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose1}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Modal.Footer>
            </Modal>
        </div>
        <div className="divB">
            <button className="X" onClick={deleteNot}>
                X
            </button>
        </div>
        </Col>
        </Row>
        <hr></hr>
    </li>;
};

export default NotifWidget;