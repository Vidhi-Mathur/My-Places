import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from "../../shared/context/auth-context";
import './PlaceForm.css'

const UpdatePlace = props => {
//Filtering out place to update on the basis of comparing extracted placeId from url and those stored in database
const placeId = useParams().placeId
const [loadedPlace, setLoadedPlace] = useState()
const {isLoading, error, sendRequest, clearError} = useHttpClient()
const auth = useContext(AuthContext);
const navigate = useNavigate()
//Here it would work fine but later when we will fetch data from a backend, we will fetch the information about a place from the here, which means it will take a short while we render this component. So we would initialy show an empty form, and a loading spinner till connects to a database

//Data isn't fetched till now
const [formState, inputHandler, setFormData] = useForm({
    //Get from stored db and if stored, it has to be valid initially
    title: {
        value: '',
        isValid: false
    },
    description: {
        value: '',
        isValid: false
    }
}, false)

useEffect(() => {
    const fetchPlace = async() => {
        try{
            const responseData = await sendRequest(`${process.env.REACT_APP_URL}/places/${placeId}`)
            setLoadedPlace(responseData.place)
            setFormData({
                title: {
                    value: responseData.place.title,
                    isValid: true
                },
                description: {
                    value: responseData.place.description,
                    isValid: true
                }
            }, true)
        }
        catch(err){
    
        }
    } 
    fetchPlace()
}, [sendRequest, placeId, setFormData])


const updatePlaceHandler = async event => {
    event.preventDefault()
    //Once received updated data, send request to backend to update in database
    try {
        await sendRequest(`${process.env.REACT_APP_URL}/places/${placeId}`, 
        'PATCH', 
        JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
        }),
        {
        //Attaching token to outgoing request
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json'
        })
        navigate('/' + auth.userId + '/places');
    }
    catch(err) {

    }
}

if(isLoading){
    return (
        <div className="center"><LoadingSpinner /></div>
    )
}

//Not found
if(!loadedPlace && !error){
    return (
    <div className="center"><Card><h2>No Place Found</h2></Card></div>
    )
}

//Update Place
return (
//When cycle runs for first time, form will be empty, hence we render form only if has data using useState()
    <>
     <ErrorModal error={error} onClear={clearError} />
     {!isLoading && loadedPlace && <form className="place-form" onSubmit={updatePlaceHandler}>
        <Input 
            id="title"
            element="input" 
            type="text" 
            label="Title" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid text" 
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
        />
        <Input 
            id="description"
            element="textarea" 
            label="Description" 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText="Please enter a valid description with atleast 5 characters" 
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
        />
        {/* Disable if form isn't valid */}
        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>}
    </>
    )
}

export default UpdatePlace


