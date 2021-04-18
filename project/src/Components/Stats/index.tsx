import React, { FC, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { STATS_WIDGET_COLORS } from "../../Constants/constants";
import { StatisticObj } from "../../Constants/interfaces";
import StatWidget from "./statsWidget";

import "./style.css";

interface Props {
	setBreadCrumb: (val: string) => void;
}
const StatsScreen : FC<Props> = ({ setBreadCrumb }) => {

    const [
        stats
        // ,useStats
    ] = useState<StatisticObj[]>(
        [
            {value : "86%", description : "Asistentes a eventos esta semana"},
            {value : "220", description : "Usuarios activos esta semana"},
            {value : "4/5", description : "Bienestar de los usuarios promedio"},
            {value : "ZEN", description : "Meditación mas popular esta semana"}
        ]
    );

    useEffect(() => {
        // Cambiamos el titulo que el dashboard tiene
        setBreadCrumb("Estadística");
    
    // eslint-disable-next-line
    },[]);

    const pickWidgetColor = (i : number) => STATS_WIDGET_COLORS[i%STATS_WIDGET_COLORS.length];

    const createStatsWidgets = () => stats.map((s,i) => <Col key={`Statistic_Widget_Col_${i}`} xs={6}><StatWidget key={`Statistic_Widget_${i}`} statValue={s.value} color={pickWidgetColor(i)} statDescription={s.description} /></Col>)

    const createStats = () => <Row>
        {createStatsWidgets()}
    </Row>;

    const filterBar = () => <div id="FilterBar">
        <div id="FilterHead">Filtrar por</div>
        <div id="Filter">Esta Semana</div>
    </div>;

    return <div>
        <Row>
            <Col xs={12}>
                <div style={{width : "100%"}}>
                    <div className="statsTitle">
                        Estadisticas
                    </div>
                </div>
            </Col>
            <Col md={8}><div className="statsWindow">{createStats()}</div></Col>
            <Col md={4}>{filterBar()}</Col>
        </Row>
    </div>;
}

export default StatsScreen;