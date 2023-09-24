import React from "react";
import { createPortal } from "react-dom"
import { CSSTransition } from 'react-transition-group'
import './SideDrawer.css';

const SideDrawer = props => {
//Portals in React is a concept that allows us to project or render a React component in a different place than it normally would be rendered. Now with portal, we can mark a new place in our HTML file, so in public index.html where we want
    const open = (
    //When sidedrawer is visible, show is true, else false. To render or to remove
         <CSSTransition in={props.show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
{/* props.onClick added as when clicked on any option in sidedrawer, it leads to page, but still sidedrawer remains open by default.Function referenced by props.onClick (which is defined in the parent component MainNavigation) will be executed*/}
                <aside className="side-drawer" onClick={props.onClick} >{props.children}</aside>
        </CSSTransition>
    )
    //Content is rendered in DOM, where ID is 'drawer-hook'
    return createPortal(open, document.getElementById('drawer-hook'));
}

export default SideDrawer;
