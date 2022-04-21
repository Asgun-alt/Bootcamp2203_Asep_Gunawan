import React from "react"
import list from './contact.js'

import {Card} from 'react-bootstrap'

export default function ContactApp () {
    const contactList = list.map((data) => {
        return (
            <React.Fragment key={data.id}>
            <Card style={{ width: '18rem' }} className='contact-list'>
            <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                <Card.Text>{data.email}</Card.Text>
                <Card.Text>{data.mobile}</Card.Text>
            </Card.Body>
            </Card>
            </React.Fragment>
        )
    })

    return (
        <div>
            {contactList}
        </div>
    )
}