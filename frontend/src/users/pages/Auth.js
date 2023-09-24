import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/imageUpload";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook"; 
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import './Auth.css'

const Auth = props => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)

    const submitHandler = async event => {
        event.preventDefault()
        console.log(formState.inputs)
        if(isLoginMode){
            try{
            //For sendRequest(), arguments are url, method, body and headers
            const responseData = await sendRequest(process.env.REACT_APP_URL + '/users/login', 
                'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                'Content-Type': 'application/json'
                }
            )
            //In backend, response returned has userId key. Forward token too
            auth.login(responseData.userId, responseData.token)
            } 
            catch(err){

            }
        }
        else{
        try{
//always in json format, having form data like name, email and password which is what we are expecting at backend. For image now, can't use JSON format. Hence using formdata. Multer helps with multipart form data. This type of data format can contain mixture of data, as JSON can work only with text data. 
            const formData = new FormData()
            formData.append('name', formState.inputs.name.value)
            formData.append('email', formState.inputs.email.value)
            formData.append('password', formState.inputs.password.value)
            formData.append('image', formState.inputs.image.value)
//Create a new user if signing in, but not for login . In both cases, have to send http request to signup and login routes respectively, using fetch api (end POST requests (and other types of requests) as well ). Other alternative being axios or oher third party libraries to send http request. Also can configure this request, like setting methods, headers and body
//This response is not automatically parsed into aJS object. Instead, it's a stream of data that we need to process. Hence, parse it to json
            const responseData =await sendRequest(process.env.REACT_APP_URL + '/users/signup', 
                'POST',
//No need to set headers too
                formData
        ) 
        auth.login(responseData.userId, responseData.token)
        } 
        catch(err){
            
        }
    }
    }

    const switchModeHandler = () => {
//Currently in signup mode and need to signup -> login mode. Drop name field, and overall form validity depends on validity of email and password
        if(!isLoginMode){
            setFormData({
                //Copy all fields and override name, otherwise 'isValid' would be undefined
                ...formState.inputs,
                name: undefined,
                //When switch from signup -> login
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
//Currently in login mode and need to login -> signup mode. Need to add name field, and overall form validity is false initially as name is missing. Copy rest including name and email
        else{
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        //Switches mode
        setIsLoginMode(prevMode => !prevMode)
    }

    return (
        <>
        <ErrorModal error={error} onClear={clearError}/>
        <Card className="authentication">
            {/* asOverlay and asOverlay={true} mean same */}
            {isLoading && <LoadingSpinner asOverlay/>}
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={submitHandler}>
                {/* Name is also required if signing up */}
                {!isLoginMode &&
                <Input 
                id="name"
                element="input"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your name"
                onInput={inputHandler}
            />}
                {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please Provide an Image"/>}
                <Input 
                    id="email"
                    element="input"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid E-Mail"
                    onInput={inputHandler}
                />
                 <Input 
                    id="password"
                    element="input"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errorText="Please enter a valid Password, with atleast 6 characters"
                    onInput={inputHandler}
                />
            <Button type="submit" disabled={!formState.isValid}>{isLoginMode? "LOGIN": "SIGNUP"}</Button>
            </form>
            <Button inverse onClick={switchModeHandler}>SWITCH TO {!isLoginMode? "LOGIN": "SIGNUP"}</Button>
        </Card>
        </>
    )
}

export default Auth