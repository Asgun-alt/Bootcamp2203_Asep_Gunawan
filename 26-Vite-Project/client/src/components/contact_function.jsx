import React, {Fragment, useState, useEffect} from "react"
import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap'
import GetContactData from './contacts_list'

export default function contactFunction () {

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

    return (
        <GetContactData handleGetContacts={getContacts}/>
    )

}