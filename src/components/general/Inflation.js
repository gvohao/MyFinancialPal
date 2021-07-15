import React from 'react';
import {CanvasJSChart} from "canvasjs-react-charts";
import {Line} from "react-chartjs-2"
import * as singstat from "../calculators/singstatjson.json";


function Inflation(props) {
    let infData = singstat.default.Level1
    let infDateArr = []
    let infValueArr = []

    //push date
    for (let i = 0; i < infData.length ; i++){
        if(infData[i].level_1 === "All Items") {
            infDateArr.push(infData[i].year)
            // console.log(infData[i].year)
        }
    }
    //push value
    for (let i = 0; i < infData.length; i++){
        if(infData[i].level_1 === "All Items") {
            infValueArr.push(infData[i].value)
        }
    }


    const state = {
            labels: infDateArr,
        datasets: [
            {
                label: 'Consumer Price Index (CPI)',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0.7,
                data: infValueArr
            },
            // {
            //     label: 'abc',
            //     fill: false,
            //     lineTension: 0.5,
            //     backgroundColor: 'rgba(75,192,192,1)',
            //     borderColor: 'rgba(0,0,0,1)',
            //     borderWidth: 1,
            //     data: [null,null,4,5,6,7,8,9,null]
            // }
        ]
    }
    return (
        <div>
            <Line
                data={state}
                options={{
                    title:{
                        display:true,
                        text:'Inflation (All-items per year)',
                        fontSize:20
                    },
                    legend:{
                        display:true,
                        position:'right'
                    },
                    axisY:{
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true
                        }
                    },
                    axisX: {
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true
                        },
                    },
                }}

            />
        </div>
    );
}

export default Inflation;
