import React, { FC } from "react";

import "./style.css";

interface Props {
    color : string,
    statValue : string,
    statDescription : string
}

const StatWidget : FC<Props> = (props) => {
    return <div className="statWidget" style={{backgroundColor : props.color}}>
        <div className="statValue">{props.statValue}</div>
        <hr className="solid customDivider"/>
        <div className="statDescription">{props.statDescription}</div>
    </div>;
}

export default StatWidget;