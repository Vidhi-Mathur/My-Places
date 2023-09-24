import React, {useReducer, useEffect} from "react";
import { validate } from "../../util/validators";
import './Input.css'

const inputReducer = (state, action) => {
    switch(action.type) {
//Tf action type is change, update value in <input> and change if valid. Validators received from props through components
        case 'CHANGE': return {
            ...state,
            value: action.val,
            //Takes type and val
            isValid: validate(action.val, action.validators)
        }
//No error initially when clicked out
        case 'TOUCH': return {
            ...state,
            isTouched: true
        }
        default: return state
    }
}

const Input = props => {
//Use reducer also allows to manage state, but diff. between useState() is that with useReducer(), we can manage more complex state with ease have interconnected state. Section argument, initial state is optional.
    const [inputState, dispatch] = useReducer(inputReducer, {
        //Has to be set already if updation required, else new
        value: props.initialValue || '', 
        isTouched: false,
        isValid: props.initialValid || false
    })

    //Extract id, onInput from props and value, isValid from input state
    const { id, onInput } = props;
    const { value, isValid } = inputState

    useEffect(() => {
    //When a change is detected in any of the items in the dependency [], useEffect() executes our function.
        onInput(id, value, isValid)}, [id, onInput, value, isValid])

    const changeHandler = event => {
        //dispatch() receives action object
        dispatch({ type: 'CHANGE', val: event.target.value, validators: props.validators})
    }

    const touchHandler = event => {
        //No other field requires
        dispatch({ type: 'TOUCH'})
    }

    //Renders both input and textarea, depending on props.element
    const element = props.element === 'input'? 
        <input id={props.id} type={props.type} placeholder={props.placeholder} onChange={changeHandler} onBlur={touchHandler} value={inputState.value}/>: 
        <textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} 
        />
    return (
        //Add additional className if invalid
        <div className={`form-control ${!inputState.isValid && inputState.isTouched &&'form-control--invalid'}`}>
            {/* htmlFor creates a link between <label> and a specific form input using 'id' */}
            <label htmlFor={props.id}>{props.label}</label>
            {/*Display error when invalid*/}
            {element} {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    )
}

export default Input