import React from "react";
import { Link } from 'react-router-dom'
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from '../../shared/components/UIElements/Card'
import './UserItem.css'

const UserItem = props => {
    return (
        //Received from userList
        <li className="user-item">
                <Card className="user-item__content">
{/*UserItem component creates a clickable link around each user item using the Link component. When the user clicks on a user item, they will be taken to a page displaying all the places visited by that user */}
                <Link to={`/${props.id}/places`}>
                <div className="user-item__image">
{/* To display user DP. Won't display despite entering correct url. By default, none of the files on server side are accessible from outside the server. It is good as otherwise one could simply enter localhost/5000/app.js and have look at source code. But this won't work as every incoming request at backend goes to middleware and only logic present inside lists of middleware exists there executes. As no middleware exists to handle image link. For this, we got a static() method that returns a middleware, hence returning a file statically serving/ returning a file from a folder with a path pointing to it. In app, all files are locked except one pointed at, so returned without any extra check*/}
                    <Avatar image={`${process.env.REACT_APP_URL}/${props.image}`} alt={props.name} />
                </div>
                <div className="user-item__info">
                    <h2>{props.name}</h2>
                    <h3>{props.placeCount} {props.placeCount === 1? 'Place': 'Places'}</h3>
                </div>
                </Link>
                </Card>
        </li>
    )
}

export default UserItem