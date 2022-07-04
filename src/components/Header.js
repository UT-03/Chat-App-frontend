import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';

const Header = () => {
    const auth = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const navigate = useNavigate();

    return (
        <React.Fragment>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>Chat App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link className="me-2" as={Link} to="/">Home</Nav.Link>
                            {auth.isLoggedIn ? (
                                <Button onClick={() => {
                                    socket.emit("user inactive", { userId: auth.userId })
                                    auth.logout();
                                }}>Logout</Button>
                            ) : (
                                <Button onClick={() => navigate('/auth')}>Login</Button>
                            )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </React.Fragment>
    );
};

export default Header;