import React, { FC } from "react";
import { Notificacion } from "../../../Constants/interfaces";

import "./style.css";

interface Props {
	notification : Notificacion
}

const NotificationWidget : FC<Props> = ({notification}) => {

    return <div className="notificationWidget">
        <h5>{notification.title}</h5>
    </div>;
}

export default NotificationWidget;