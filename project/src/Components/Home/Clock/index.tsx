import React, { FC } from "react";
import { useTime } from 'react-timer-hook';

/**
 * @returns Auto Updating Time of the Day using a Hook
 */
const ClockTime: FC = () => {

    const {
        seconds,
        minutes,
        hours,
        ampm,
      } = useTime({ format: '12-hour'});

    const minuteFixer = (minute : number) : string => {
        if(minute < 10) {
            return `0${minute}`;
        }
        return `${minute}`;
    }

    const intermitentDots = (seconds : number) => (seconds % 2 === 0) ? ":" : " ";

    return <div>
        <span>{hours}</span>{intermitentDots(seconds)}<span>{minuteFixer(minutes)+" "}</span><span>{ampm}</span>
    </div>;
}

export default ClockTime;