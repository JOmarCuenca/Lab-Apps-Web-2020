import React from "react";
import NVD3Chart from "react-nvd3";
import * as Values from "../../Constants/values";
import { Col, Collapse, Form } from "react-bootstrap";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { FirebaseContext } from "../../API/Firebase";
import { valueMonedas } from "../../Constants/values.tsx";


const Individual_Query_Y = {
  moneda1: "moneda1",
  moneda2: "moneda2",
  moneda5: "moneda5",
  moneda5CC: "moneda5CC",
  moneda5CG: "moneda5CG",
  moneda10: "moneda10",
  boletoNorm: "boletoNorm",
  boletoTrans: "boletoTrans",
  boletoDesc: "boletoDesc",
  boletoPreP: "boletoPreP",
  specialSum: "suma",
};

const GananciaPorDiaChart = ({ client, data, yTag, xTag }) => {
  const firebase = React.useContext(FirebaseContext);
  const [rawData, setRawData] = React.useState([]);
  const [logs, setLogs] = React.useState([]);
  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [open, setOpen] = React.useState(false);

  const totalSum = (data) => {
    const infoToAdd = [
      Individual_Query_Y.moneda1,
      Individual_Query_Y.moneda2,
      Individual_Query_Y.moneda5,
      Individual_Query_Y.moneda10,
      Individual_Query_Y.moneda5CC,
      Individual_Query_Y.moneda5CG,
    ];
    let value = 0;
    infoToAdd.forEach((moneda) => {
      const temp = moneda ?? "moneda1";
      const valor = data[moneda] ?? 0;
      value += valor * valueMonedas(temp);
    });
    return value;
  };

  React.useEffect(() => {
    if(client === ""){
      return;
    }
    firebase.firestore
      .collection("Clientes")
      .doc(client)
      .collection("Log")
      .orderBy("fechaInicio")
      .get()
      .then((logs) => {
        let temp = [];
        logs.docs.forEach((log, key) => {
          let initialDate = new Date(log.data().fechaInicio);
          let stringDate =
            initialDate.getFullYear().toString() +
            "/" +
            initialDate.getMonth().toString() +
            "/" +
            initialDate.getDay().toString();
          let today = new Date();
          let todayStrong =
            today.getFullYear().toString() +
            "/" +
            today.getMonth().toString() +
            "/" +
            today.getDay().toString();
          let existElement = temp.find(
            (dateElem) => dateElem.label === stringDate
          );
          if (!existElement && stringDate === todayStrong) {
            //stringDate === '2020/5/4'
            temp.push({
              label: stringDate,
              value: totalSum(log.data()),
              color: Values.ARRAY_OF_COLORS[key % Values.ARRAY_OF_COLORS.length]//datum[0].values[key % datum[0].values.length].color,
            });
          } else if (stringDate === todayStrong) {
            existElement.value += totalSum(log.data());
          }
        });
        // console.log(temp);
        setRawData(temp);
        setLogs(logs);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    // console.log(logs)
    if (logs.docs !== undefined) {
      let temp = [];
      logs.docs.forEach((log, key) => {
        let initialDate = new Date(log.data().fechaInicio);
        console.log(initialDate > state[0].startDate)
        console.log(initialDate < state[0].endDate)
        if (initialDate >= state[0].startDate && initialDate <= state[0].endDate) {
          let stringDate =
            initialDate.getFullYear().toString() +
            "/" +
            initialDate.getMonth().toString() +
            "/" +
            initialDate.getDay().toString();
          let existElement = temp.find(
            (dateElem) => dateElem.label === stringDate
          );
          if (!existElement) {
            //stringDate === '2020/5/4'
            temp.push({
              label: stringDate,
              value: totalSum(log.data()),
              color: Values.ARRAY_OF_COLORS[key % Values.ARRAY_OF_COLORS.length]//datum[0].values[key % datum[0].values.length].color,
            });
          } else {
            existElement.value += totalSum(log.data());
          }
        }
      });
      console.log(temp);
      setRawData(temp);
    }
    // eslint-disable-next-line
  }, [state]);

  return (
    <>
      <Col md={3} xs={12}>
        <Form.Control
          // plaintext
          readOnly
          value={
            state[0].startDate
              ? state[0].startDate.toLocaleDateString() + ' - ' + state[0].endDate.toLocaleDateString()
              : "Selecciona un rango"
          }
          onClick={() => setOpen(!open)}
        />
        <Collapse in={open}>
          <DateRange
            className="mt-3"
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={true}
            ranges={state}
          />
        </Collapse>
      </Col>
      <NVD3Chart
        tooltip={{ enabled: true }}
        type="discreteBarChart"
        datum={[{ key: "Some", values: rawData }]}
        x="label"
        y="value"
        height={300}
        showValues
      />
    </>
  );
};

export default GananciaPorDiaChart;
