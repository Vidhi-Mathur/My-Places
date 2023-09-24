import React, { useState } from "react";
import { Link } from 'react-router-dom'
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import BackDrop from '../UIElements/Backdrop'
import './MainNavigation.css';

const MainNavigation = props => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)
    const openDrawerHandler = () => { setDrawerIsOpen(true) };
    const closeDrawerHandler = () => { setDrawerIsOpen(false) };
    return (
        <>
{/*When the user clicks the menu button, openDrawerHandler() is called, and the SideDrawer becomes visible along with the Backdrop. When the user clicks anywhere on the Backdrop, closeDrawerHandler() is called, and the SideDrawer is hidden, and the Backdrop disappears.
SideDrawer component provides the navigation links and slides in when the menu button is clicked, while the Backdrop component provides the background overlay effect when the SideDrawer is active.  */}
        {/* If drawer is open, <Backdrop> is rendered behind sidedrawer, that takes closeDrawerHandler() to render */}
        {drawerIsOpen && <BackDrop onClick={closeDrawerHandler}/>}
{/*If drawer is open, <SideDrawer> will be rendered, else null. Close when clicked on option in sidedrawer*/}
        {<SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
            <nav className="main-navigation__drawer-nav">
                <NavLinks />
            </nav>
        </SideDrawer>}
        {/* What we insert here will end up in MainHeader instead of props.children */}
        <MainHeader>
            {/* When click on hamburger icon, open drawer */}
            <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
                <span />
                <span />
                <span />
            </button>
            {/* Clickable title , leads to homepage */}
            <h1 className="main-navigation__title">
                <Link to="/">YourPlaces</Link>
                </h1>
            <nav className="main-navigation__header-nav">
                <NavLinks />
            </nav>
        </MainHeader>
        </>
    )
}

export default MainNavigation