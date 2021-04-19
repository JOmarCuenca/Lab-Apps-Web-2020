import React, { FC } from "react";
import { Notificacion } from "../../../../Constants/interfaces";

import "./style.css";

interface Props {
    child : Notificacion,
    alterScreen : (val: Notificacion) => void;
}
const NotifWidget : FC<Props> = (p) => {

    const isAlive = () : boolean => {
        const timeOfDeath = p.child.fecha.getTime() + (p.child.lifetime ?? 24) * 60 * 60 * 1000;
        const now = new Date();
        return now.getTime() < timeOfDeath;
    }

    return <div className="NotifWidget" onClick={() => p.alterScreen(p.child)}>
        <h3>{p.child.title}</h3>
        {isAlive() ? <h5>On</h5> : <></>}
        <h5>X</h5>
    </div>;
};

export default NotifWidget;