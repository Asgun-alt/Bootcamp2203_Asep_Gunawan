import React, { Component } from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import { render } from 'react-dom'

class Navigation extends Component {
    constructor(props){
        super(props)
        this.state = {date: new Date()}
    }

    componentDidMount(){
        this.timerID = setInterval(() => this.tick(), 1000)
    }

    tick(){
        this.setState({
            date: new Date()
        })
    }
    render()
    {
        return(

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#features">Home</Nav.Link>
                        <Nav.Link href="#pricing">About</Nav.Link>
                        <Nav.Link href="#pricing">Contact</Nav.Link>
                    </Nav>
                    <Nav>
                    <Nav.Link>{this.state.date.toLocaleTimeString()}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        )
}
}

export default Navigation