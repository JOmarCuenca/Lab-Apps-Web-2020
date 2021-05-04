import React, { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { Evento } from "../../Constants/interfaces";
import EventosForm from "../Eventos/EditForm";
import EventWidget from "./EventWidget";
import "./style.css";

/*
    Documentation for this can be found in here:
    https://react-bootstrap.github.io/components/modal/
*/

interface Props {
    event : Evento
}

const EventContainer : FC<Props> = ({event}) => {

    const [show,setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <>
        <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show} onHide={handleClose}>
            <Modal.Header>
            <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="ModalEditForm">
                    <EventosForm event={event} />
                </div>
            </Modal.Body>
        </Modal>
        <EventWidget event={event} openEdit={handleShow} />
    </>;
}

export default EventContainer;