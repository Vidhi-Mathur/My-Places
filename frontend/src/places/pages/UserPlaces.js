import React, { useEffect, useState } from 'react';
//Hook to exact dynamic parametes from url
import { useParams, useNavigate } from 'react-router-dom'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
        const [loadedPlaces, setLoadedPlaces] = useState()
        const { isLoading, error, sendRequest, clearError } = useHttpClient()
        const navigate = useNavigate()
        const userId = useParams().userId
        //Sending request. Useeffect() to prevent creating infinite loops on re-rendering. Hence this function will only render once component is mounted
        useEffect(() => {
            //To get all places for a specific user
            const fetchPlaces = async() => {
                try{
                    const responseData = await sendRequest(`${process.env.REACT_APP_URL}/places/user/${userId}`)
                    //In backend, we expect places[] for user
                    setLoadedPlaces(responseData.places)
                }
                catch(err){
    
                }
            }
            fetchPlaces()
        }, [sendRequest, userId])

        const placeDeleteHandler = placeId => {
            //Filter out the deleted place to save rest of them
            setLoadedPlaces(places => places.filter(p => p.id !== placeId))
            navigate(`/${userId}/places`);
        }

        return (
            <>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <div className='center'><LoadingSpinner /></div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
            </>
        )
    }

export {UserPlaces}