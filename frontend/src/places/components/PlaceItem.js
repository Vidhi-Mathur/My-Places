import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = props => {
    const auth = useContext(AuthContext)
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const [showMap, setShowMap] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);
    const openDeleteHandler = () => setShowDelete(true);
    const openCancelHandler = () => setShowDelete(false);
    const confirmDeleteHandler = async() => {
        setShowDelete(false)
        try{
            //Forwarded through props already
            await sendRequest(`${process.env.REACT_APP_URL}/places/${props.id}`, 'DELETE', 
            //No method required
            null,
            {
                Authorization: 'Bearer ' + auth.token
            })
            //Forward onDelete() execute through that prop on placeList
            props.onDelete(props.id);
//Once deleted reload the place we are currently at to update. In 'PlaceList' component, map the list of places into place items, getting our items from userPlaces. In userPlaces, we have our loadedPlaces. So we need to update loadedPlace once delete a place
        } 
        catch(err) {

        }
    }
    return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading && <div className='center'><LoadingSpinner /></div>}
    <Modal 
    show={showMap} onCancel={closeMapHandler} header={props.address}
    contentClass="place-item__modal-content"
    footerClass="place-item__modal-actions"
    //To close Modal
    footer={<Button onClick={closeMapHandler}>CLOSE</Button>} >
        <div className="map-container" style={{ padding: "5px" }}>
{/* An iframe (short for inline frame) is an HTML element used to embed another HTML document within the current document. It allows to display content from another web page or source within your own web page.
The source leads the map to a specific place based on coordinates. So, the coordinates we got from the URL of Google Maps while searching are parsed as a string so they could be properly interpreted and understood as one big URL link which as transmited to src and searched for.*/}
        <iframe 
                title="map" 
                width="100%"
                height="100%" 
                src={'https://maps.google.com/maps?q=' + props.coordinates.lat.toString() + ',' + props.coordinates.long.toString() + '&t=&z=15&ie=UTF8&iwloc=&output=embed'}>
        </iframe>
        <script type='text/javascript' src='https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165'>
        </script>
</div>
    </Modal>
    <Modal show={showDelete} onCancel={openCancelHandler} header="Are You Sure?" footerClass="place-item__modal-actions" 
    //Footer contains two buttons, cancel and delete
    footer={
        <>
            <Button inverse onClick={openCancelHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
        </>
    }>
        <p>Do you want to proceed and delete this place? Please note that it can't be done thereafter.</p>
    </Modal>
    {/*Received from PlaceList */}
    <li className="place-item">
    <Card className="place-item__content">
    {isLoading && <LoadingSpinner asOverlay/>}
    <div className="place-item__image">
        {/* Display place image */}
        <img src={`${process.env.REACT_APP_URL}/${props.image}`} alt={props.title} />
    </div>
    <div className="place-item__info">
        <h3>{props.title}</h3>
        <h3>{props.address}</h3>
        <p>{props.description}</p>
    </div>
    <div className="place-item__actions">
        <Button inverse onClick={openMapHandler}>View On Map</Button>
        {/* Display only if logged in user has id same as creator*/}
        {auth.userId === props.creator && (<Button to={`/places/${props.id}`}>Edit</Button>)}
        {auth.userId === props.creator && (<Button danger onClick={openDeleteHandler}>Delete</Button>)}
    </div>
    </Card>
    </li>
    </>
    )
}

export default PlaceItem