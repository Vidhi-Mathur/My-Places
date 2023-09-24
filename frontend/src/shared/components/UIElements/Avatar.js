import React from "react";
import './Avatar.css'

const Avatar = props => {
    return (
//applies class of avatar and any additional class passed through the props.className
        <div className={`avatar ${props.className}`} style={props.style}>
{/*Sets the inline styles for the <img> element. The props.width prop is used to define both the width and height of the image to display as a square. */}
            <img src={props.image} alt={props.alt} style={{width: props.width, height: props.width}} />
        </div>
    )
}

export default Avatar