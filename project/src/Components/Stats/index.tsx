import React, { FC, useContext, useEffect, useState } from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { FirebaseContext } from "../../API/Firebase";
import { STATS_WIDGET_COLORS } from "../../Constants/constants";
import { StatisticObj } from "../../Constants/interfaces";
import StatsGraphsScreen from "./Graphs";
import StatWidget from "./statsWidget";

import "./style.css";

interface Props {
	setBreadCrumb: (val: string) => void;
}
const StatsScreen : FC<Props> = ({ setBreadCrumb }) => {

    const firebase = useContext(FirebaseContext);

    const [stats,setStats]              = useState<StatisticObj[]>([]);
    const [showGraphs,setShowGraphs]    = useState(false);


    const [loaded,setLoaded] = useState(false);

    useEffect(() => {
        // Cambiamos el titulo que el dashboard tiene
        setBreadCrumb("Estadística");

        // Descargamos las estadisticas de la base de datos para desplegarlas en pantalla.
        firebase.getStats()
        .then(statsRemote => setStats(statsRemote))
        .finally(() => setLoaded(true));
    // eslint-disable-next-line
    },[]);

    const pickWidgetColor = (i : number) => STATS_WIDGET_COLORS[i%STATS_WIDGET_COLORS.length];

    const createStatsWidgets = () => stats.map((s,i) => <Col key={`Statistic_Widget_Col_${i}`} xs={6}><StatWidget key={`Statistic_Widget_${i}`} stat={s} color={pickWidgetColor(i)} /></Col>)

    const createStats = () => <Row>
        {createStatsWidgets()}
    </Row>;

    const renderTooltip = (props : any) => (
        <Tooltip id="button-tooltip" {...props}>
          Click para cambiar a Graficas
        </Tooltip>
      );

    const filterBar = () => <div id="FilterBar">
        <div id="FilterHead">Filtrar por</div>
        <OverlayTrigger
            placement="auto"
            delay={{ show: 100, hide: 200 }}
            overlay={renderTooltip}
        >
            <div id="Filter" onClick={() => setShowGraphs(true)} >Esta Semana</div>
        </OverlayTrigger>
    </div>;

    const renderRecentStats = [
        <Col md={8}><div className="statsWindow">{createStats()}</div></Col>,
        <Col md={4}>{filterBar()}</Col>
    ];

    const renderStats = () => <Row>
        <Col xs={12}>
            <div style={{width : "100%"}}>
                <div className="statsTitle">
                    Estadisticas
                </div>
            </div>
        </Col>
        {showGraphs ? <StatsGraphsScreen goBack={() => setShowGraphs(false)} /> : renderRecentStats}
    </Row>;

    const renderLoading = () => <div><h1>Loading...</h1></div>

    return <div>{loaded ? renderStats() : renderLoading()}</div>;
}

export default StatsScreen;