import React, { Fragment } from "react";
import {Table, Button} from 'react-bootstrap'
import UpdateContact from "./contact_update";
import DetailContact from "./contact_detail"


export default function Contacts({handleGetContacts, handleContactDetail, handleContactDelete}) {

        return (
            <Fragment>

                <div>
                    <Table responsive='sm' bg='light'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {handleGetContacts?.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>
                            <DetailContact contact={contact}/>{' '}
                            <UpdateContact contact={contact} />{' '}
                            <Button variant="danger" onClick={() => handleContactDelete(contact.id)}>Delete</Button>
                            </td>
                        </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

            </Fragment>
        )

}