import React from 'react';
import NVD3Chart from 'react-nvd3';
import * as Values from "../../Constants/values";

// const datum = [
//     {key: "One", y: 29, color: "#ff8a65"},
//     {key: "Two", y: 0, color: "#f4c22b"},
//     {key: "Three", y: 32, color: "#04a9f5"},
//     {key: "Four", y: 196, color: "#3ebfea"},
//     {key: "Five", y: 2, color: "#4F5467"},
//     {key: "Six", y: 98, color: "#1de9b6"},
//     {key: "Seven", y: 13, color: "#a389d4"},
//     {key: "Eight", y: 5, color: "#FE8A7D"}
// ];

class PieDonutChart extends React.Component {

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
        const result = [];
        let i = 0;
        this.state.rawData.forEach(bar => {
            const label = (bar[0]) ? bar[0]:"";
            const value = (bar[1]) ? bar[1]:0 ;
            result.push({
                "key"   : label,
                "y"     : value,
                "color" : Values.ARRAY_OF_COLORS[i]
            });
            i++;
            if(i>=Values.ARRAY_OF_COLORS.length){
                i=0;
            }
        });
        return result;
    }

    render() {
        const datum = this.createDatum();
        return <NVD3Chart id="chart" height={300} type="pieChart" datum={datum} x="key" y="y" donut labelType='percent' />
    }
}

export default PieDonutChart;