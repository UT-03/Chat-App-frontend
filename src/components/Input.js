import React, { useReducer, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

import { validate } from '../utils/validators';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            }
        default:
            return state;
    }
}

const Input = (props) => {
    const [multiInputData, setMultiInputData] = useState(props.initialValue || ['']);

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || (props.element === 'multi-input' ? [''] : ''),
        isTouched: false,
        isValid: props.initialValid || false
    });

    const { id, onInput, invalidateFormOnChange } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        if (onInput)
            onInput(id, value, isValid, invalidateFormOnChange);
    }, [id, value, isValid, onInput]);

    const changeHandler = (event, index) => {
        let val = event.target.value;

        if (event.target.type === 'checkbox')
            val = event.target.checked;

        if (props.type === 'file')
            val = event.target.files[0];

        if (props.element === 'multi-input') {
            const multiInputData$ = [...multiInputData];
            multiInputData$[index] = event.target.value;
            setMultiInputData(() => multiInputData$);
            val = multiInputData$;
        }

        dispatch({
            type: 'CHANGE',
            val: val,
            validators: props.validators
        });

        if (props.onChange)
            props.onChange(val);
    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };

    const isInputInvalid = !inputState.isValid && inputState.isTouched;

    let element;
    switch (props.element) {
        case 'input':
            element = <Form.Group className='mb-4'>
                <Form.Label className={`${isInputInvalid && "text-danger"}`}>{props.label}</Form.Label>
                <Form.Control
                    className={`${isInputInvalid && "invalid border border-danger"}`}
                    id={props.id}
                    type={props.type}
                    placeholder={props.placeholder}
                    onChange={changeHandler}
                    onBlur={touchHandler}
                    value={inputState.value}
                    disabled={props.disabled} />
                {!inputState.isValid && inputState.isTouched && (
                    <Form.Text className="text-danger d-block">{props.errorText || 'This field is required.'}</Form.Text>
                )}
                <Form.Text className="text-muted">{props.extraText}</Form.Text>
            </Form.Group>
            break;
        case 'file':
            element = <Form.Group className='mb-4'>
                <Form.Label className={`${isInputInvalid && "text-danger"}`}>{props.label}</Form.Label>
                <Form.Control
                    className={`${isInputInvalid && "invalid border border-danger"}`}
                    id={props.id}
                    type="file"
                    placeholder={props.placeholder}
                    onChange={changeHandler}
                    onBlur={touchHandler}
                    disabled={props.disabled}
                    ref={props.reference} />
                {!inputState.isValid && inputState.isTouched && (
                    <Form.Text className="text-danger d-block">{props.errorText || 'This field is required.'}</Form.Text>
                )}
                <Form.Text className="text-muted">{props.extraText}</Form.Text>
            </Form.Group>
            break;
        case 'textarea':
            element = <Form.Group className='mb-4'>
                <Form.Label className={`${isInputInvalid && "text-danger"}`}>{props.label}</Form.Label>
                <Form.Control
                    className={`${isInputInvalid && "invalid border border-danger"}`}
                    as="textarea"
                    id={props.id}
                    rows={props.rows || 3}
                    type={props.type}
                    placeholder={props.placeholder}
                    onChange={changeHandler}
                    onBlur={touchHandler}
                    value={inputState.value}
                    disabled={props.disabled} />
                {!inputState.isValid && inputState.isTouched && (
                    <Form.Text className="text-danger d-block">{props.errorText || 'This field is required.'}</Form.Text>
                )}
                <Form.Text className="text-muted">{props.extraText}</Form.Text>
            </Form.Group>
            break;
        case 'select':
            element = <Form.Group className="mb-4">
                <Form.Label className={`${isInputInvalid && "text-danger"}`}>{props.label}</Form.Label>
                <Form.Select
                    className={`${isInputInvalid && "invalid border border-danger"}`}
                    onChange={changeHandler}
                    onBlur={touchHandler}
                    value={inputState.value}
                    disabled={props.disabled}
                >
                    <option value="">{props.defaultOption}</option>
                    {props.options.map((option, index) => <option key={index}>{option}</option>)}
                </Form.Select>
                {!inputState.isValid && inputState.isTouched && (
                    <Form.Text className="text-danger d-block">{props.errorText || 'This field is required.'}</Form.Text>
                )}
                <Form.Text className="text-muted">{props.extraText}</Form.Text>
            </Form.Group>
            break;
        case 'checkbox':
            element = <Form.Check
                className='mb-4'
                type={props.type}
                label={props.label}
                checked={props.checked}
                defaultChecked={props.defaultChecked}
                onClick={(e) => props.onClick(e.target.checked)}
                disabled={props.disabled}
            />
            break;
    }
    return (
        <React.Fragment>
            {element}
        </React.Fragment>
    );
};

export default Input;

