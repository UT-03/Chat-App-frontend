import React, { useContext, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../hooks/FormHook';
import { VALIDATOR_EMAIL, VALIDATOR_EQUAL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../utils/validators';
import Input from './Input';
import AuthContext from '../context/AuthContext';
import { useHttpClient } from '../hooks/HttpHook';
import ErrorModal from './ErrorModal';
import SocketContext from '../context/SocketContext';

const AuthForm = (props) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const { socket } = useContext(SocketContext);

    const navigate = useNavigate();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: "",
            isValid: false
        },
        password: {
            value: "",
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            return sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
                'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            )
                .then(res => {
                    auth.login(res.token, res.userId)
                    return res.userId;
                })
                .then((userId) => {
                    socket.emit('user active', { userId: userId });
                })
                .then(() => {
                    navigate('/');
                })
        } else {
            return sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
                'POST',
                JSON.stringify({
                    name: formState.inputs.name.value,
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            )
                .then(res => {
                    auth.login(res.token, res.userId);
                    return res.userId;
                })
                .then((userId) => {
                    // socket.emit('user active', { userId: userId });
                })
                .then(() => {
                    navigate('/');
                })
        }
    };

    return (
        <React.Fragment>
            <ErrorModal
                error={error}
                show={!!error}
                onHide={clearError} />
            <Container>
                <Form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            label="Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={inputHandler} />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email."
                        onInput={inputHandler} />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
                        extraText="Password must be at least six characters long."
                        onInput={inputHandler}
                        invalidateFormOnChange={isLoginMode ? false : true} />
                    {!isLoginMode && (
                        <Input
                            id="confirmPassword"
                            element="input"
                            type="password"
                            label="Confirm Password"
                            validators={[VALIDATOR_EQUAL(formState.inputs.password.value)]}
                            errorText="Passwords do not match."
                            onInput={inputHandler} />
                    )}
                    <Button
                        className='d-block mx-auto'
                        type="submit"
                        disabled={!formState.isValid || isLoading}
                    >
                        {isLoading && (
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className='me-1'
                            />
                        )}
                        {isLoginMode ? 'Login' : 'Signup'}
                    </Button>

                    <div className='fs-6 text-center mt-2'>
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"} Switch to <span
                            className='text-primary fw-semibold'
                            style={{ cursor: "pointer" }}
                            onClick={switchModeHandler}>
                            {isLoginMode ? 'Signup' : 'Login'}.
                        </span>
                    </div>
                </Form>
            </Container>
        </React.Fragment>
    );
};

export default AuthForm;