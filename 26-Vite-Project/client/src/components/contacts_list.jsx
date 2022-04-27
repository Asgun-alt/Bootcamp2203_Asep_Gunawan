import React, { Fragment } from "react";
import {Table, Button} from 'react-bootstrap'
import UpdateContact from "./contact_update"
import DetailContact from "./contact_detail"
import CreateContact from './contact_create'
import HandleDeleteContact from './contact_delete'


export default function Contacts({handleGetContacts}) {

        return (
            <Fragment>
                <div>
                    <CreateContact />
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
                        {handleGetContacts.map((contact, index) => (
                        <tr key={contact.id}>
                            <td>{index+1}</td>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>
                            <DetailContact contact={contact}/>{' '}
                            <UpdateContact contact={contact} />{' '}
                            <HandleDeleteContact contact={contact} />{' '}
                            </td>
                        </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

            </Fragment>
        )

}