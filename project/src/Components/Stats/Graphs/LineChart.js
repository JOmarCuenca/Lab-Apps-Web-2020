import React from 'react';
import NVD3Chart from 'react-nvd3';
import { STATS_GRAPH_COLORS } from '../../../Constants/constants';

function getDatum() {
    var sin = [],
        sin2 = [],
        cos = [];
    for (var i = 0; i < 100; i++) {
        sin.push({
            'x': i,
            'y': Math.sin(i / 10)
        });
        cos.push({
            'x': i,
            'y': .5 * Math.cos(i / 10)
        });
    }
    for(let i =0; i<100;i++){
        sin2.push({
            'x': i,
            'y': Math.sin(i / 10) * 0.25 + 0.5
        });
    }
    return [
        {
            values: sin,
            key: 'Sine Wave',
            color: '#A389D4'
        },
        {
            values: cos,
            key: 'Cosine Wave',
            color: '#04a9f5'
        },
        {
            values: sin2,
            key: 'Another sine wave',
            color: '#1de9b6',
            area: true
        }
    ];
}

class LineChart extends React.Component {

    /*
     * [{ key : NAME OF GRAPH,
     *     values : [ x : number , y : number]},
     *  { key : NAME OF GRAPH,
     *     values : [ x : number , y : number]},
     *  { key : NAME OF GRAPH,
     *     values : [ x : number , y : number]}] 
     */

    constructor(props){
        super(props);
        this.state = {
            rawData     : (props.data)?props.data:[],
            yAxis       : (props.yTag)?props.yTag:"",
            xAxis       : (props.xTag)?props.xTag:"Fecha",
            colorOffset : (props.colorOffset)?props.colorOffset:0,
        };
    }

    componentDidUpdate(){
        if(this.props.data !== this.state.rawData){
            this.setState({rawData : this.props.data});
        }
        else if(this.props.yTag !== this.state.yAxis){
            this.setState({yAxis : this.props.yTag});
        }
        else if(this.props.xTag !== this.state.xAxis){
            this.setState({xAxis : this.props.xTag});
        }
    }

    createDatum(){
        let i = this.state.colorOffset;
        this.state.rawData.forEach(bar => {
            bar.color = STATS_GRAPH_COLORS[i];
            if(i%3 === 0){
                bar.area = true;
            }
            i++;
            if(i>=STATS_GRAPH_COLORS.length){
                i=0;
            }
        });
        return this.state.rawData;
    }

    render() {
        const data = this.createDatum();
        return (
            <div>
                {
                    React.createElement(NVD3Chart, {
                        xAxis: {
                            tickFormat: function(d){ 
                                return (new Date(d)).toLocaleString().split(",")[0]; 
                            },
                            axisLabel: this.state.xAxis,
                        },
                        yAxis: {
                            axisLabel: this.state.yAxis,
                            tickFormat: function(d) {return parseFloat(d).toFixed(2); }
                        },
                        type:'lineChart',
                        datum: data,
                        x: 'x',
                        y: 'y',
                        height: 300,
                    })
                }
            </div>
        )
    }
}

export default LineChart;