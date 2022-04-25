import React, {Fragment, useState} from "react";
import {Modal, Button, Form} from 'react-bootstrap'

export default function DetailContactFunction ({contact}) {

    const [name] = useState(contact.name)
    const [email] = useState(contact.email)
    const [mobile] = useState(contact.mobile)

      // Modal function
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Fragment>
            <Button variant="primary" onClick={handleShow}>
                Detail
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>DETAIL CONTACT</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <Form.Label><h6>Name :  {name}</h6></Form.Label>
                <br />

                <Form.Label><h6>Email : {email}</h6></Form.Label>
                <br />

                <Form.Label><h6>Mobile : {mobile}</h6></Form.Label>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}