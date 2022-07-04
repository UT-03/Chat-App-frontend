import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ChatContainer from '../components/ChatContainer';
import { useHttpClient } from '../hooks/HttpHook';
import ErrorModal from '../components/ErrorModal';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const [selectedChat, setSelectedChat] = useState(undefined);
    const [users, setUsers] = useState();

    const { isLoading, sendRequest, error, clearError } = useHttpClient();

    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchAllUsers = () => {
            sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/user/`,
                'GET',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                })
                .then(({ allUsers }) => {
                    setUsers(allUsers);
                })
        }

        fetchAllUsers();
    }, []);

    return (
        <React.Fragment>
            <ErrorModal
                error={error}
                show={!!error}
                onHide={clearError} />
            {users && (
                <Container className="mt-3">
                    <Row style={{ height: "80vh" }}>
                        <Col xs={3}>
                            <ListGroup className="rounded-0">
                                {users.map(user => {
                                    return (
                                        <ListGroup.Item
                                            className={`${selectedChat === user._id ? 'bg-secondary text-white' : ''}`}
                                            key={user._id}
                                            onClick={() => setSelectedChat(user._id)}>
                                            <Row>
                                                <Col xs={12} className="px-0" style={{ cursor: "pointer" }}>{user.name}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>
                        </Col>
                        <Col xs={9}>
                            <ChatContainer
                                selectedChat={selectedChat} />
                        </Col>
                    </Row>
                </Container>
            )}
        </React.Fragment>
    );
};

export default Home;