import React, {Fragment, useState, useEffect} from "react"
import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap'
import GetContactData from './contacts_list'

export default function contactFunction () {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")

    const onSubmitForm = async (event) => {
        event.preventDefault()
        try {
            const body = {name, email, mobile}
            console.log(body)
            const response = await fetch('http://localhost:3001/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            window.location = "/contacts"
        } catch (error) {
            console.error(error.message)
        }
    }

    const [getContacts, setGetContacts] = useState([])

    const handleGetContacts = async () => {
        try {
            const response = await fetch('http://localhost:3001/contacts')
            const jsonData = await response.json()

            setGetContacts(jsonData)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        handleGetContacts()
    }, [])

    const handleContactDelete = async (id) => {
        try {
            const getDeleteContact = await fetch(`http://localhost:3001/contact/delete/${id}`, {
                method: 'DELETE'
            })

            setGetContacts(contacts.filter(contact => contact.id !== id))
            // window.location = "/contacts"
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
            <Button variant="primary" onClick={handleShow}>
                Add New Contact
            </Button>

            {/* ADD NEW CONTACT MODAL */}
            <form onSubmit={onSubmitForm}>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ADD NEW CONTACT</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Name</InputGroup.Text>
                    <FormControl
                        aria-label="Small"
                        type="text"
                        name="name"
                        value={name}
                        aria-describedby="inputGroup-sizing-sm"
                        onChange={e => setName(e.target.value)}
                    />
                </InputGroup>
                <br />

                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Email</InputGroup.Text>
                    <FormControl
                        aria-label="Small"
                        type="text"
                        name="email"
                        value={email}
                        aria-describedby="inputGroup-sizing-sm"
                        onChange={e => setEmail(e.target.value)}
                        />
                </InputGroup>
                <br />

                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Mobile</InputGroup.Text>
                    <FormControl
                        aria-label="Small"
                        type="text"
                        name="mobile"
                        value={mobile}
                        aria-describedby="inputGroup-sizing-sm"
                        onChange={e => setMobile(e.target.value)}
                    />
                </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type="submit" variant="primary" onClick={onSubmitForm}>
                    Save Contact
                </Button>

                </Modal.Footer>
            </Modal>
            </form>


        <GetContactData 
        handleGetContacts={getContacts}
        handleContactDelete={handleContactDelete}
        />

        </Fragment>
    )

}