import React, { FC } from "react";
import { Notificacion } from "../../../Constants/interfaces";
import infoIcon from "../../../Assets/img/info.png";

import "./style.css";

interface Props {
	notification : Notificacion
}

const NotificationWidget : FC<Props> = ({notification}) => {

    return <div className="notificationWidget">
        <img src={infoIcon} alt="infoIcon" className="infoIconBtnNotif" />
        <h5>{notification.title}</h5>
    </div>;
}

export default NotificationWidget;