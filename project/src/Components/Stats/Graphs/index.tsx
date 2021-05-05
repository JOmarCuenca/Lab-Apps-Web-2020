import React, { FC, useEffect } from "react";
// import BarChart from "./BarDiscreteChart";
// import PieChart from "./PieDonutChart";
// import LineChart from "./LineChart";
// import { FirebaseContext } from "../../API/Firebase";
// import { useHistory } from "react-router-dom";
// import * as XLSX from "xlsx";
import 'react-widgets/dist/css/react-widgets.css';
// import { Multiselect } from 'react-widgets'

// import { Container, Row, Col, Card, Dropdown, Button, Form } from "react-bootstrap";
// import {
//   Months,
// } from "../../Constants/values";

import "./style.css";
// import GananciaPorDiaChart from "./GananciaPorDiaChart";

interface Props {
  goBack : () => void
}

const StatsGraphsScreen: FC<Props> = ({goBack}) => {

  // const firebase = useContext(FirebaseContext);
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

    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   filterCronInfo(cronData,cronGraphParams.xAxis,cronUnitsToShow);
  //   // eslint-disable-next-line
  // },[cronGraphParams.xAxis]);

  // useEffect(() => {
  //   filterCronInfo(cronData,cronGraphParams.xAxis,cronUnitsToShow);
  //   // eslint-disable-next-line
  // },[cronUnitsToShow]);

  // useEffect(() => {
  //   handleCronGraph();
  //   // eslint-disable-next-line
  // },[cronGraphParams.date]);

  // function filterForBars(
  //   rawData: firebase.firestore.QueryDocumentSnapshot[] = [],
  //   xAxis: Criteria,
  //   yAxis: Individual_Query_Y
  // ) {
  //   setBarsData([]);
  //   xAxis = xAxis ?? "id";
  //   yAxis = yAxis ?? "boletoNorm";
  //   let filter: any = {};
  //   rawData.forEach((doc) => {
  //     const data = doc.data();
  //     const key = (data[xAxis] as string) ?? "";
  //     const value = (data[yAxis] as number) ?? 0;
  //     if (!filter[key]) {
  //       filter[key] = 0;
  //     }
  //     filter[key] += value;
  //   });
  //   const result = [];
  //   for (let doc in filter) {
  //     result.push([doc, filter[doc]]);
  //   }
  //   barXAxis.current = xAxis;
  //   barYAxis.current = yAxis;
  //   setBarsData(result);
  // }

  // function filterForPie(
  //   rawData: firebase.firestore.QueryDocumentSnapshot[] = [],
  //   xAxis: Criteria,
  //   yAxis: Individual_Query_Y
  // ) {
  //   setPieData([]);
  //   xAxis = xAxis ?? "id";
  //   yAxis = yAxis ?? "boletoNorm";
  //   let filter: any = {};
  //   rawData.forEach((doc) => {
  //     const data = doc.data();
  //     const key = (data[xAxis] as string) ?? "";
  //     const value = (data[yAxis] as number) ?? 0;
  //     if (!filter[key]) {
  //       filter[key] = 0;
  //     }
  //     filter[key] += value;
  //   });
  //   const result = [];
  //   for (let doc in filter) {
  //     result.push([doc, filter[doc]]);
  //   }
  //   pieXAxis.current = xAxis;
  //   pieYAxis.current = yAxis;
  //   setPieData(result);
  // }

  //V2 of the algorithm
  // async function filterForLines(
  //   rawData: firebase.firestore.QueryDocumentSnapshot[],
  //   yAxis: Individual_Query_Y,
  //   criteria: Criteria,
  //   specific: string
  // ) {
  //   setLinesData([]);
  //   const xAxis = Fechas.fechaCorte;
  //   yAxis = yAxis ?? Individual_Query_Y.boletoNorm;
  //   //Setting the information
  //   lineGraphCriteria.current = criteria;
  //   lineYAxis.current = yAxis;
  //   let dropDownOptions: any = {};
  //   for (let doc of rawData) {
  //     //Establecer el criterio
  //     const info = doc.data();
  //     const tag = getTag(info, criteria);
  //     if (!dropDownOptions[tag]) {
  //       dropDownOptions[tag] = null;
  //     }
  //   }
  //   const filteredKeys = Object.keys(dropDownOptions);
  //   if (filteredKeys.length < 1) {
  //     //There are no options to enlist
  //     return;
  //   }
  //   if (specific === "") {
  //     //An option hasn't been specified yet.
  //     specific = filteredKeys[0];
  //   }
  //   const monthsCollector: any = {};
  //   lineOptions.current = filteredKeys;
  //   lineSpecific.current = specific;
  //   let filter = {
  //     key: specific,
  //     values: monthsCollector,
  //   };
  //   /* filter = {
  //    *  key : x,
  //    *  values : {
  //    *      0 :{
  //    *          1 : valor,
  //    *          2 : valor,
  //    *          .
  //    *          .
  //    *          .
  //    *          30 : valor,
  //    *      }
  //    *      1 :{
  //    *          1 : valor,
  //    *          2 : valor,
  //    *          .
  //    *          .
  //    *          .
  //    *          30 : valor,
  //    *      }
  //    *      2 :{
  //    *          1 : valor,
  //    *          2 : valor,
  //    *          .
  //    *          .
  //    *          .
  //    *          30 : valor,
  //    *      }
  //    *      .
  //    *      .
  //    *      .
  //    *      11 : ...,
  //    *  }
  //    * }
  //    *
  //    */
  //   rawData.forEach((doc) => {
  //     const info = doc.data();
  //     const grafica = getTag(info, criteria);
  //     if (grafica === specific) {
  //       let value = 0;
  //       if (yAxis === Individual_Query_Y.specialSum) {
  //         value += totalSum(info);
  //       } else {
  //         value += (info[yAxis] ?? 0) as number;
  //       }
  //       let day = 1;
  //       let month = 0;
  //       const temp = firebase.toDateTime(info[xAxis] as number);
  //       day = temp.getDate();
  //       month = temp.getMonth();
  //       if (!filter.values[month]) {
  //         filter.values[month] = {};
  //       }
  //       if (!filter.values[month][day]) {
  //         filter.values[month][day] = 0;
  //       }
  //       filter.values[month][day] += value;
  //     }
  //   });

  //   //Mandar la informacion filtrada a un Array y lanzar.
  //   const result = [];
  //   // (filter[graph].values as any[]).forEach((month : number,dayValues : any) => {//Por cada mes
  //   for (let monthKey in filter.values) {
  //     //Por cada mes
  //     const month = parseInt(monthKey);
  //     const monthString = Months[month];
  //     const dayValues = filter.values[month];
  //     const temp = [];
  //     if (!dayValues[1]) {
  //       dayValues[1] = 0;
  //     }
  //     for (let day in dayValues) {
  //       //Por cada dia del mes
  //       temp.push({ x: parseInt(day), y: dayValues[day] });
  //     }
  //     result.push({
  //       key: monthString,
  //       values: temp,
  //     });
  //   }
  //   setLinesData(result);
  // }

  return <div>
    <h1>WIP</h1>
    <button onClick={goBack}>Go Back</button>
  </div>;
};

export default StatsGraphsScreen;
