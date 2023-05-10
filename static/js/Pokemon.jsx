import React from "react";
function Pokemon(props) {
    return <React.Fragment>
        <div>Show Pokemon's info</div>
        <img src="{props.image}" alt="pokemon image" />
        <div>id: {props.id}</div>
        <div>name: {props.name}</div>
        {/* <div>height: {props.height}</div>
        <div>weight: {props.weight}</div> */}
    </React.Fragment>
}
export default Pokemon;