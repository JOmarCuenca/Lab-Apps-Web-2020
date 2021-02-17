import React from 'react';
import NVD3Chart from 'react-nvd3';
import * as Values from "../../Constants/values";

// const datum = [
//     {
//         key: "Cumulative Return",
//         values: [{
//             "label": "A",
//             "value": 29.765957771107,
//             // "value": -29.765957771107,
//             "color": "#3ebfea"
//         }, {
//             "label": "B",
//             "value": 10,
//             "color": "#04a9f5"
//         }, {
//             "label": "C",
//             "value": 32.807804682612,
//             "color": "#ff8a65"
//         }, {
//             "label": "D",
//             "value": 196.45946739256,
//             "color": "#1de9b6"
//         }, {
//             "label": "E",
//             "value": 0.25434030906893,
//             "color": "#4C5667"
//         }, {
//             "label": "F",
//             "value": 98.079782601442,
//             // "value": -98.079782601442,
//             "color": "#69CEC6"
//         }, {
//             "label": "G",
//             // "value": -13.925743130903,
//             "value": 13.925743130903,
//             "color": "#a389d4"
//         }, {
//             "label": "H",
//             // "value": -5.1387322875705,
//             "value": 5.1387322875705,
//             "color": "#FE8A7D"
//         }]
//     }
// ];

class BarDiscreteChart extends React.Component {

    /*
    rawData = [
        ["Conductor 1", 150],
        ["Condcutor 2", 300],
        ["Conductor 3", 450],
        ["Conductor 4", 600],
        ["Conductor 5", 750],
    ];
    */

    constructor(props){
        super(props);
        this.state = {
            rawData : (props.data)?props.data:[],
        };
    }

    componentDidUpdate(){
        if(this.props.data !== this.state.rawData){
            this.setState({rawData : this.props.data});
        }
    }

    createDatum(){
        const result = [{key : "Cumulative Return",values : []}];
        let i = 0;
        this.state.rawData.forEach(bar => {
            const label = (bar[0]) ? bar[0]:"";
            const value = (bar[1]) ? bar[1]:0 ;
            result[0].values.push({
                "label" : label,
                "value" : value,
                "color" : Values.ARRAY_OF_COLORS[i]
            });
            i++;
            if(i>=Values.ARRAY_OF_COLORS.length){
                i=0;
            }
        })
        return result;
    }

    render() {
        const datum = this.createDatum();
        // console.log(this.datum);
        return <NVD3Chart tooltip={{enabled: true}} type="discreteBarChart" datum={datum} x="label" y="value" height={300} showValues />
    }
}

export default BarDiscreteChart;