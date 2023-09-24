import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
    switch(action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true
            //state has input property, and get through it using loop
            for(const inputID in state.inputs){
                if(!state.inputs[inputID]){
                    continue
                }
                //Check if we have right now is same as inputId as stored in action
                if(inputID === action.inputID){
                    //Combining previous and new to update validity
                    formIsValid = formIsValid && action.isValid
                }
                else{
                    formIsValid = formIsValid && state.inputs[inputID].isValid
                }

            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputID]: {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                //Overall form validity
                isValid: formIsValid
            }
        case 'SET_DATA': 
            return {
                //On action in setFormData in dispatch, has inputs and formIsValid key
                inputs: action.inputs,
                isValid: action.formIsValid
            }
        default: return state    
    }
}

export const useForm = (initialInputs, initialValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        //Check for individual validity
        inputs: initialInputs,
        isValid: initialValidity
    })

     //When onInput is passed to <Input> through props, there onInput triggers this titleInputHandler again. Now if we do here anything that changes state of NewPlace() and re-renders it, this titleInputHandler() will be recreated as it lies inside this NewPlace() func. only, leading to infinite loop
     const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputID: id
        })
    }, [])

    //Initially empty, once found data, update form using hook
    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
    }, [])

    //Final state for what uses hook; setFormData is required only in updataPlace, not in newPlaces
    return [formState, inputHandler, setFormData]
}