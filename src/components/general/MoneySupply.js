import React from 'react';

import {Line} from "react-chartjs-2";
import * as moneysupply from "./M3supply.json";

function MoneySupply(props) {

    let moneySupply = moneysupply.default
    console.log(moneySupply)
    let moneyData = moneysupply.default.Level2.slice(125)
    console.log(moneyData)
    let moneyArr = []
    let moneyDateArr = []
    for(let i = 0; i < moneyData.length; i++) {
        if(moneyData[i].level_2 === "M2"){
            moneyArr.push(moneyData[i].month)
            moneyDateArr.push(moneyData[i].value)
        }
        // if(moneyData[i].month == "1991") {
        //     console.log("got the moneth")
        // }
    }
    console.log(moneyArr)
    console.log(moneyDateArr)
    // console.log(moneyData)

    const state = {
        labels: moneyDateArr,
        datasets: [
            {
                label: 'M2 Money Supply (Singapore)',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0.7,
                data: moneyArr
            },
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

export default MoneySupply;
