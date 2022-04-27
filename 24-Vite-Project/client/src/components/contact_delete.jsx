import React, { Fragment, useState } from "react";
import {Button} from 'react-bootstrap'

export default function handleDelete ({contact}) {

    const [getContacts, setGetContacts] = useState([])

    const handleContactDelete = async (id) => {
        try {
            const getDeleteContact = await fetch(`http://localhost:3001/contact/delete/${contact.id}`, {
                method: 'DELETE'
            })
            
            window.location = "/contacts"
            setGetContacts(contact.filter(contact => contact.id !== id))
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <Fragment>
            <Button variant="primary" onClick={handleContactDelete}>Delete</Button>
        </Fragment>
    )

}