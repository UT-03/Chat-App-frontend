import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ErrorModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    An Error Ocurred!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.error}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Okay</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;