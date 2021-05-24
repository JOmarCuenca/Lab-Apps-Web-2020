import React, { FC, useState,  useContext} from "react";
import { FirebaseContext } from "../../../API/Firebase";
import { Col, Row, Modal} from "react-bootstrap";
import { Notificacion } from "../../../Constants/interfaces";

import "./style.css";

interface Props {
    child : Notificacion,
    index : number,
    deleteFromList : (i: number) => void,
    alterScreen : (val: Notificacion) => void;
}

interface ModifiedNotif {
    title : string,
    desc  : string
}

const NotifWidget : FC<Props> = (p) => {

    const firebase = useContext(FirebaseContext);

    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [modifiedNotif,setModifiedNotif] = useState<ModifiedNotif>({
        title   : "",
        desc    : ""
    });
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setModifiedNotif({
            title   : p.child.title,
            desc    : p.child.descripcion
        });
        setShow(true);
    };

    const handleClose1 = () => {
        p.child.title = String($("#tituloNot").val());
        p.child.descripcion = String($("#descNot").val());
        firebase.updateNotificacion(p.child);
        setShow1(false);
        handleClose();
    } 
    const handleShow1 = () => setShow1(true);

    const isAlive = () : boolean => {
        const timeOfDeath = p.child.fecha.getTime() + (p.child.lifetime ?? 24) * 60 * 60 * 1000;
        const now = new Date();
        return now.getTime() < timeOfDeath;
    }

    const deleteNotif = () => {
        firebase.deleteNotificacionById(p.child.id).then(() =>{
            p.deleteFromList(p.index);
        });
    }

    return <li className="NotifWidget" id={`list_element_${p.index}`}>
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
            <Modal className="modalp" show={show} onHide={handleClose} >
                <Modal.Header>
                        <Modal.Title>{p.child.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{p.child.descripcion}</Modal.Body>
                <Modal.Footer>
                    {isAlive() ? <button onClick={handleShow1}>Actualizar</button> : <></>}
                    <Modal className="modalp" show={show1} onHide={handleClose1} backdrop="static" >
                        <Modal.Header>
                                <textarea className="tituloNot" id="tituloNot" value={modifiedNotif.title} onChange={(s) => setModifiedNotif({
                                    ...modifiedNotif,
                                    title : s.currentTarget.value
                                })}  />
                        </Modal.Header>
                        <Modal.Body>
                            <textarea className="descNot" id="descNot" value={modifiedNotif.desc} onChange={(s) => setModifiedNotif({
                                ...modifiedNotif,
                                desc : s.currentTarget.value
                            })}  />
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleClose1}>
                                Guardar
                            </button>
                        </Modal.Footer>
                    </Modal>
                </Modal.Footer>
            </Modal>
        </div>
        <div className="divB">
            <button id="closeBtn" onClick={deleteNotif}>
                X
            </button>
        </div>
        </Col>
        </Row>
        <hr></hr>
    </li>;
};

export default NotifWidget;