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
        <div>
            <h5 className="Child">{p.child.title}</h5>
        </div>
        <div>
            {isAlive() ? <h6 className="On">ON</h6> : <></>}
        </div>
        <div>
            <h6 className="X">X</h6>
        </div>
        <hr></hr>
    </div>;
};

export default NotifWidget;