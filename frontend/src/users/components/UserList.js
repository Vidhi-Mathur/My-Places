import React from "react";
import './UserList.css'
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UserList = props => {
    //No users found
    if(props.items.length === 0){
        return (
            <div className="center">
                <Card><h2>No users found</h2></Card>
            </div>
        )
    }
//Return list of users as js[] initially, now mapped as jsx, along with that special unique key, along with other properties
    return (
        <ul className="users-list">
            {props.items.map(user => (
            //This is what userItems takes
            <UserItem key={user.id}
            id = {user.id}
            image = {user.image}
            name = {user.name}
            placeCount = {user.places.length}
            />
            ))}
        </ul>
    )
}

export default UserList