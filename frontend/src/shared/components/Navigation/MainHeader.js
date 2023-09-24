import React from "react";
import './MainHeader.css'

const MainHeader = props => {
    return (
//Refers to things passed between opening and closing, replaced by what is inserted in MainNavigation.js, between <MainHeader>
        <header className="main-header">{props.children}</header>
    )
}

export default MainHeader