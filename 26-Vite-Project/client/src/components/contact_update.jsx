import React, {Fragment, useState} from "react";
import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap'

export default function UpdateContactFunction ({contact}) {

    const [updateName, setUpdateName] = useState(contact.name)
    const [updateEmail, setUpdateEmail] = useState(contact.email)
    const [updateMobile, setUpdateMobile] = useState(contact.mobile)

    const handleUpdate = async event => {
        event.preventDefault()
        try {
            const body = {updateName, updateEmail, updateMobile}

            const response = await fetch(`http://localhost:3001/contact/${contact.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            })
            
            window.location = "/contacts"
        } catch (error) {
            console.error(error.message)
        }
    }

    // Modal function
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Fragment>
            <Button variant="warning" onClick={handleShow}>
                Update
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>UPDATE CONTACT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Name</InputGroup.Text>
                    <FormControl
                        aria-label="Small"
                        type="text"
                        aria-describedby="inputGroup-sizing-sm"
                        name="name"
                        value={updateName}
                        onChange={e => setUpdateName(e.target.value)}
                    />
                </InputGroup>

                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Email</InputGroup.Text>
                    <FormControl
                        aria-label="Small"
                        type="text"
                        aria-describedby="inputGroup-sizing-sm"
                        name="email"
                        value={updateEmail}
                        onChange={e => setUpdateEmail(e.target.value)}
                    />
                </InputGroup>

                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Mobile</InputGroup.Text>
                    <FormControl
                        aria-label="Small"
                        type="text"
                        aria-describedby="inputGroup-sizing-sm"
                        name="mobile"
                        value={updateMobile}
                        onChange={e => setUpdateMobile(e.target.value)}
                    />
                </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}