import React, { useState, useEffect } from "react";
import axios from "axios";
import { uid } from "uid";
import GetContacts from "./contact_page";

import { Button, Modal, InputGroup, FormControl, Form } from "react-bootstrap";

export default function ContactApp() {
  const [contacts, setContacts] = useState([]);

  // show modal add
  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  // show modal edit
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  // show modal detail
  const [showDetail, setShowDetail] = useState(false);
  const handleCloseDetail = () => setShowDetail(false);
  const handleShowDetail = () => setShowDetail(true);

  // show modal close
  const [showClose, setShowClose] = useState(false);
  const handleCloseClose = () => setShowClose(false);
  const handleShowClose = () => setShowClose(true);

  //get contacts from json file
  useEffect(() => {
    //get data from json
    axios.get("http://localhost:8000/contacts").then((res) => {
      console.log(res.data);
      setContacts(res?.data ?? []);
    });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [detailData, setDetailData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [isUpdate, setIsUpdate] = useState({
    id: null,
    status: false,
  });

  function handleAdd(event) {
    event.preventDefault();
    let data = [...contacts];
    console.log(data);

    //validation
    if (formData.name === "") {
      return false;
    }
    if (formData.email === "") {
      return false;
    }
    if (formData.mobile === "") {
      return false;
    }
  }

  function handleChange(event) {
    console.log(isUpdate.status)
    let data = { ...formData };
    //get value from input
    data[event.target.name] = event.target.value;
    setFormData(data);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // alert("ok");

    //validation
    if (formData.name === "") {
      return false;
    }
    if (formData.email === "") {
      return false;
    }
    if (formData.mobile === "") {
      return false;
    }

    if (isUpdate.status) {
      data.forEach((contact) => {
        if (contact.id === isUpdate.id) {
            contact.name = formData.name,
            contact.email = formData.email,
            contact.mobile = formData.mobile;
        }
      });
    } else {
      data.push({ id: uid(), name: formData.name, mobile: formData.mobile });
    }

    //save contact
    let data = [...contacts];
    setContacts(data);
    setFormData({ name: "", email: "", mobile: "" });
  }

  function handleEdit(id) {
    let data = [...contacts];
    setShowEdit(true);
    let foundData = data.find((contact) => contact.id === id);
    setFormData({
      name: foundData.name,
      email: foundData.email,
      mobile: foundData.mobile,
    });

    setIsUpdate({ id: id, status: true });
  }

  function handleDetail(id) {
    let data = [...contacts];
    setShowDetail(true);
    let foundData = data.find((contact) => contact.id === id);
    setDetailData({
      name: foundData.name,
      email: foundData.email,
      mobile: foundData.mobile,
    });

    setIsUpdate({ id: id, status: true });
  }

  function handleAdd(event) {
    event.preventDefault();
    let data = [...contacts];

    //validation
    if (formData.name === "") {
      return false;
    }
    if (formData.email === "") {
      return false;
    }
    if (formData.mobile === "") {
      return false;
    }

    if (isUpdate.status) {
      data.forEach((contact) => {
        if (contact.id === isUpdate.id) {
          contact.name = formData.name;
          contact.email = formData.email;
          contact.mobile = formData.mobile;
        }
      });

      axios
        .put(`http://localhost:8000/contacts/${isUpdate.id}`, {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
        })
        .then((res) => {
          setShowEdit(false);
        });
    } else {
      let newData = {
        id: uid(),
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
      };
      data.push(newData);
      setShowAdd(false);

      axios.post("http://localhost:8000/contacts", newData).then((res) => {
        alert("Data has been Saved");
      });
    }
  }

  function handleDelete(id) {
    let data = [...contacts];
    let filteredData = data.filter((contact) => contact.id !== id);

    axios.delete(`http://localhost:8000/contacts/${id}`).then((res) => {
      alert("Data has been Deleted");
    });

    setContacts(filteredData);
  }

  // Modal function
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <React.Fragment>
      {/* Add contact modal */}
      <Button variant="primary mb-3" onClick={handleShowAdd}>
        Add Contact
      </Button>
      <form onSubmit={handleAdd}>
        <Modal show={showAdd} onHide={handleCloseAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Add Contact From</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">Name</InputGroup.Text>
              <FormControl
                aria-label="Small"
                type="text"
                name="name"
                aria-describedby="inputGroup-sizing-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </InputGroup>
            <br />
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">Email</InputGroup.Text>
              <FormControl
                aria-label="Small"
                type="text"
                name="email"
                aria-describedby="inputGroup-sizing-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </InputGroup>
            <br />
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">
                Mobile
              </InputGroup.Text>
              <FormControl
                aria-label="Small"
                type="text"
                name="mobile"
                aria-describedby="inputGroup-sizing-sm"
                value={formData.mobile}
                onChange={handleChange}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAdd} type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
      {/* Update Contact Modal */}
      <form onSubmit={handleEdit}>
        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Detail Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">Name</InputGroup.Text>
              <FormControl
                aria-label="Small"
                type="text"
                name="name"
                aria-describedby="inputGroup-sizing-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </InputGroup>
            <br />
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">Email</InputGroup.Text>
              <FormControl
                aria-label="Small"
                type="text"
                name="email"
                aria-describedby="inputGroup-sizing-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </InputGroup>
            <br />
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">
                Mobile
              </InputGroup.Text>
              <FormControl
                aria-label="Small"
                type="text"
                name="mobile"
                aria-describedby="inputGroup-sizing-sm"
                value={formData.mobile}
                onChange={handleChange}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAdd} type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </form>

      {/* Detail Form */}
      <Modal show={showDetail} onHide={handleCloseDetail}>
          <Modal.Header closeButton>
            <Modal.Title>Update Contact From</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Name : {detailData.name}</Form.Label>
            <br />
            <Form.Label>Email : {detailData.email}</Form.Label>
            <br />
            <Form.Label>Mobile : {detailData.mobile}</Form.Label>
          </Modal.Body>
        </Modal>

      <GetContacts
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleDetail={handleDetail}
        data={contacts}
      />
      ;
    </React.Fragment>
  );
}
