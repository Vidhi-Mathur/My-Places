import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const PlaceList = props => {
//No places found
        if(props.items.length === 0){
            return (
                <div className="place-list center">
                    <Card>
                        <h2>No Places Found. Maybe Create One?</h2>
                        <Button to='/places/new'>Add Place</Button>
                    </Card>
                </div>
            )
        }
//Return list of places, which is js[] initially, mapped as jsx now along with special key and properties
        return (
            <ul className="place-list">{
                    props.items.map(places => (
                        <PlaceItem key={places.id}
                        id={places.id}
                        creator={places.creator}
                        image={places.image}
                        title={places.title}
                        description={places.description}
                        address={places.address}
                        coordinates={places.location}
                         //Received on UserPlaces in PlaceList component having PlaceItem here
                        onDelete = {props.onDeletePlace}
                    />
                    ))}
            </ul>
        )
}

export default PlaceList