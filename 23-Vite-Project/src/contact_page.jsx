import React from "react";

import { Card, CardGroup, Button } from "react-bootstrap";

export default function contactList({ data, handleEdit, handleDetail, handleDelete }) {
  const getContacts = data.map((data_contact) => {
    return (
      <React.Fragment key={data_contact.id}>
        <CardGroup className="cards" s>
          <Card>
            <Card.Body>
              <Card.Title>{data_contact.name}</Card.Title>
              <Card.Text>{data_contact.email}</Card.Text>
              <Card.Text>{data_contact.mobile}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button
                onClick={() => handleEdit(data_contact.id)}
                variant="outline-info"
              >
                Update
              </Button>{" "}
              <Button
                onClick={() => handleDetail(data_contact.id)}
                variant="outline-primary"
              >
                Detail
              </Button>{" "}
              <Button
                onClick={() => handleDelete(data_contact.id)}
                variant="outline-danger"
              >
                Delete
              </Button>
            </Card.Footer>
          </Card>
        </CardGroup>
      </React.Fragment>
    );
  });

  return <div>{getContacts}</div>;
}

// npx json-server --watch src/contacts.json --port 8000
