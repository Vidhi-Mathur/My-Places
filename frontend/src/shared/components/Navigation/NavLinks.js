import React, { useContext } from "react";
import { NavLink } from 'react-router-dom'
import { AuthContext } from "../../context/auth-context";
import './NavLinks.css'

const NavLinks = props => {
//Re-renders whenever context we are listening to changes
const auth = useContext(AuthContext)
return (
    <ul className="nav-links">
{/*NavLink is special version of the <Link> that will add styling attributes to the rendered element when it matches the current URL. */}
        <li><NavLink to="/">ALL USERS</NavLink></li>
        {auth.isLoggedIn && <li><NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink></li>}
        {auth.isLoggedIn && <li><NavLink to="/places/new">ADD PLACE</NavLink></li>}
        {!auth.isLoggedIn && <li><NavLink to="/users/login">AUTHENTICATE</NavLink></li>}
        {auth.isLoggedIn && <li><button onClick={auth.logout}>LOGOUT</button></li>}
    </ul>
 )
}

export default NavLinks 