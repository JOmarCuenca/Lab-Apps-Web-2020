import React, { FC } from "react";
import { STATS_CATEGORIES } from "../../../Constants/constants";
import { getMeditiationName, usersPrettify } from "../../../Constants/functions";
import { StatisticObj } from "../../../Constants/interfaces";

import "./style.css";

interface Props {
    color: string,
    stat: StatisticObj
}

const StatWidget: FC<Props> = ({ color, stat }) => {

    /**
     * Function that returns the predetermined value of the desired statistic.
     * @param s Type of Statistic
     * @returns Description of that particular Statistic
     */
    function getStatDescription(s: STATS_CATEGORIES): string {
        switch (s) {
            case STATS_CATEGORIES.activeUsersPercent:
                return "Asistentes a eventos esta semana";
            case STATS_CATEGORIES.totalActiveUsers:
                return "Usuarios activos esta semana";
            case STATS_CATEGORIES.avgWellBeing:
                return "Bienestar de los usuarios promedio";
            case STATS_CATEGORIES.mostPopularMeditation:
                return "Meditación mas popular esta semana";
        }
    }

    

    /**
     * This function reformats the value of the statisctic object 
     * in order to be visualized properly.
     * @param s Statisctic Object to render
     * @returns String reformated Value
     */
    function formatStatValue(s: StatisticObj): string {

        let value: string;

        switch (s.category) {
            case STATS_CATEGORIES.activeUsersPercent:
                value = `${Math.round(s.value)}%`;
                break;
            case STATS_CATEGORIES.totalActiveUsers:
                value = usersPrettify(s.value);
                break;
            case STATS_CATEGORIES.avgWellBeing:
                value = `${s.value}/5`;
                break;
            case STATS_CATEGORIES.mostPopularMeditation:
                value = getMeditiationName(s.value);
        }

        return value.toString();
    }

    return <div className="statWidget" style={{ backgroundColor: color }}>
        <div className="statValue">{formatStatValue(stat)}</div>
        <hr className="solid customDivider" />
        <div className="statDescription">{getStatDescription(stat.category)}</div>
    </div>;
}

export default StatWidget;