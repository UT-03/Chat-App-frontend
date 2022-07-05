import React, { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHttpClient } from '../hooks/HttpHook';
import AuthContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';

const ChatContainer = ({ selectedChat }) => {
    const [chatMessages, setChatMessages] = useState();
    const [messageText, setMessageText] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);

    const { sendRequest } = useHttpClient();

    const auth = useContext(AuthContext);

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        socket.on("msg-recieve", ({ sender, message }) => {
            if (selectedChat && sender.toString() === selectedChat.toString()) {
                setChatMessages(prevState => {
                    return [
                        ...prevState,
                        message
                    ]
                })
            }
        });
    }, [selectedChat]);

    useEffect(() => {
        if (selectedChat) {
            setLoadingMessages(true);
            sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/user/messages/${selectedChat}`,
                'GET',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )
                .then(({ messages }) => {
                    setChatMessages(messages);
                    setLoadingMessages(false);
                })
        }
    }, [selectedChat]);

    return (
        <React.Fragment>
            {selectedChat ? (
                <React.Fragment>
                    {loadingMessages ? (
                        <h6>Loading...</h6>
                    ) : (
                        <React.Fragment>
                            <Row style={{
                                height: "90%",
                                overflow: "auto"
                            }} className="d-flex flex-column p-3">
                                {chatMessages && chatMessages.map((msg, index) => {
                                    return (
                                        <Row
                                            key={index}
                                            className={`mx-0 py-2 px-3 my-1 rounded-5 text-white ${msg.fromSelf ? 'bg-primary' : 'bg-secondary'}`}
                                            style={{
                                                maxWidth: "40%",
                                                alignSelf: `${msg.fromSelf ? 'end' : 'start'}`
                                            }}>
                                            {msg.text}
                                        </Row>
                                    )
                                })}
                            </Row>
                            <Row>
                                <Form
                                    onSubmit={event => {
                                        event.preventDefault();

                                        sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/user/send-message`,
                                            'POST',
                                            JSON.stringify({
                                                text: messageText,
                                                to: selectedChat
                                            }),
                                            {
                                                'Content-Type': 'application/json',
                                                Authorization: 'Bearer ' + auth.token
                                            }
                                        ).then(res => {
                                            socket.emit("send-msg", {
                                                from: auth.userId,
                                                to: selectedChat,
                                                text: messageText
                                            })
                                            setChatMessages(prevState => {
                                                return [
                                                    ...prevState,
                                                    {
                                                        text: messageText,
                                                        fromSelf: true
                                                    }
                                                ]
                                            })
                                            setMessageText('');
                                        })
                                    }}>
                                    <Row>
                                        <Col xs={11} className="d-flex flex-column justify-content-center">
                                            <Form.Control
                                                type="text"
                                                placeholder="Type your message here..."
                                                className="py-2 h-100"
                                                onChange={(e) => setMessageText(e.target.value)}
                                                value={messageText}

                                            />
                                        </Col>
                                        <Col xs={1}>
                                            <Button
                                                type="submit">Send</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                        </React.Fragment>
                    )}
                </React.Fragment>
            ) : (
                <h1>Please select a user to see messages.</h1>
            )}
        </React.Fragment>
    );
};

export default ChatContainer;