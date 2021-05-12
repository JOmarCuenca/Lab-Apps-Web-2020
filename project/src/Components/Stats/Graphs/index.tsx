import React, { FC, useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import 'react-widgets/dist/css/react-widgets.css';
import { FirebaseContext } from "../../../API/Firebase";
import { MEDITATION_TYPES_ARRAY, STATS_CATEGORIES } from "../../../Constants/constants";
import { getMeditiationName, getToday } from "../../../Constants/functions";
import { StatisticObj } from "../../../Constants/interfaces";
import BarDiscreteChart from "./BarDiscreteChart";
import LineChart from "./LineChart";

import "./style.css";

const StatsGraphsScreen: FC = () => {

  const firebase = useContext(FirebaseContext);
  const [initialDate] = useState(new Date(getToday().getTime() - 4 * 7 * 24 * 3600 * 1000));
  // const [initialDate, setInitialDate] = useState(new Date());
  const [stats,setStats] = useState<StatisticObj[]>([])
  // const history = useHistory();

  //Hooks for all the types of Graphs.
  // const [barsData, setBarsData]   = useState(Array<Array<any>>());
  // const [pieData, setPieData]     = useState(Array<Array<any>>());
  // const [linesData, setLinesData] = useState(Array<any>());
  // const [queryBarsData,setQueyBarsData] = useState<Array<any>>([]);

  // const downloadExcel = (e: any) => {
  //   e.preventDefault();
  //   const cols = [
  //     "Unidad",
  //     "Fecha de Inicio",
  //     "Fecha de Corte",
  //     "Nombre Conductor",
  //     "Apellido Conductor",
  //     "Boleto Descuento",
  //     "Boleto Normal",
  //     "Boleto Prepago",
  //     "Boleto Trans",
  //     "Moneda 5CC",
  //     "Moneda 5CG",
  //     "Moneda 1",
  //     "Moneda 2",
  //     "Moneda 5",
  //     "Moneda 10",
  //   ];
  //   let data = [cols];
  //   logs.current.forEach((element) => {
  //     let info = element.data();
  //     data.push([
  //         info.id,
  //         new Date(info.fechaInicio),
  //         new Date(info.fCorte),
  //         info.nombreConductor,
  //         info.apellidoConductor,
  //         info.boletoDesc,
  //         info.boletoNorm,
  //         info.boletoPreP,
  //         info.boletoTrans,
  //         info.moneda5CC,
  //         info.moneda5CG,
  //         info.moneda1,
  //         info.moneda2,
  //         info.moneda5,
  //         info.moneda10
  //     ]);
  //   });
  //   const ws = XLSX.utils.aoa_to_sheet(data);
  //   /* build a workbook */
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Data");
  //   /* generate XLSX file and send to client */
  //   XLSX.writeFile(wb, `Data.xlsx`);
  // };

  useEffect(() => {
    firebase.getStatsWithDates(initialDate)
    .then((objs) => setStats(objs));
    // eslint-disable-next-line
  }, []);

  const graphMostPopularMeditation = () => {
    const meditationStats = stats.filter((meditation) => meditation.category === STATS_CATEGORIES.mostPopularMeditation);
    const curatedStats = 
    MEDITATION_TYPES_ARRAY.map(type => {
      return {
        "label" : getMeditiationName(type),
        "value" : meditationStats.filter(s => s.value === type).length
      };
    });

    return <Col xs={5}>
      <h3>Meditación más Popular</h3>
      <BarDiscreteChart data={curatedStats} />
    </Col>
  }

  const graphPercentageOfUsers = () => {
    const activeUsers = stats.filter((stat) => stat.category === STATS_CATEGORIES.activeUsersPercent);
    const curatedStats = 
    activeUsers.sort((a,b) => a.createdDate.getTime() - b.createdDate.getTime()).map(stat => {
      return {
        "label" : stat.createdDate.toLocaleString().split(",")[0],
        "value" : stat.value
      };
    });

    return <Col xs={7}>
      <h3>Porcentaje de Asistencia a Eventos</h3>
      <BarDiscreteChart data={curatedStats} width={600} />
    </Col>
  }

  const graphActiveUsers = () => {
    const activeUsersStats = stats.filter((stat) => stat.category === STATS_CATEGORIES.totalActiveUsers);
    const curatedStats = activeUsersStats.sort((a,b) => b.createdDate.getTime() - a.createdDate.getTime()).map(obj => {return {
      "x" : obj.createdDate,
      "y" : obj.value
    }});

    return <Col xs={12}>
      <h3>Número de Usuarios Activos</h3>
        <LineChart data={[
          {
            values : curatedStats,
            key : "Usuarios Activos"
          },
        ]} xTag="Fecha" />
      </Col>;
  }

  const graphHealthinessOfUsers = () => {
    const activeUsersStats = stats.filter((stat) => stat.category === STATS_CATEGORIES.avgWellBeing);
    const curatedStats = activeUsersStats.sort((a,b) => b.createdDate.getTime() - a.createdDate.getTime()).map(obj => {return {
      "x" : obj.createdDate,
      "y" : obj.value
    }});

    return <Col xs={12}>
      <h3>Promedio de Bienestar General</h3>
        <LineChart data={[
          {
            values : curatedStats,
            key : "Bienestar General"
          },
        ]} xTag="Fecha" colorOffset={1} />
      </Col>;
  }

  return <div id="Charts" >
    <Row>
      {graphMostPopularMeditation()}
      {graphPercentageOfUsers()}
      {graphActiveUsers()}
      {graphHealthinessOfUsers()}
    </Row>
  </div>;
};

export default StatsGraphsScreen;
