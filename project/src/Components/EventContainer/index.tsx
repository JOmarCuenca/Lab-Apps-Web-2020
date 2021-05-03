import React, { FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Evento } from "../../Constants/interfaces";
import EventWidget from "./EventWidget";

interface Props {
    event : Evento
}

const EventContainer : FC<Props> = ({event}) => {

    const [show,setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <>
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        <EventWidget event={event} openEdit={handleShow} />
    </>;
}

export default EventContainer;