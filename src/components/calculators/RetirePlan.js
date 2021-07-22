import React, {useEffect, useState, useRef} from 'react';
import axios from "axios";
import {Col, Row, Button} from "react-bootstrap";
import * as singstat from "./singstatjson.json"
import {isNumber} from "chart.js/helpers";
import {useHistory} from "react-router-dom";

function RetirePlan({user}) {
    let history = useHistory()

    const initialState = { startFund: 0, retireExpense: 0, retireAge: 0, startAge: 0, lifeExp: 0, expReturns: 0.05}
    const [retireForm, setRetireForm] = useState(initialState)
    function handleChange(e) {
        setRetireForm({...retireForm, [e.target.name] : e.target.value})
    }

    const [drawdownPeriod, setDrawdownPeriod] = useState(0)
    const [startInfYear, setStartInfYear] = useState(0)
    const [endInfYear, setEndInfYear] = useState(0)
    const [startInfValue, setStartInfValue] = useState(0)
    const [endInfValue, setEndInfValue] = useState(0)
    const [cumInflation, setCumInflation] = useState(0)
    const [annualInflation, setAnnualInflation] = useState(0)
    const [realReturns, setRealReturns] = useState(0)
    const [show, setShow] = useState(false)

    let data = singstat.default.Level1
    let infData = []
    for(let i = 0; i < data.length; i++){
        if(data[i].level_1 === "All Items"){
            infData[i/3] = {
                year: data[i].year,
                value: data[i].value
            }
        }
    }
    let accPeriod = 0;
    if(accPeriod > data[data.length-1].year - data[0].year){
        accPeriod = (data[data.length-1].year - data[0].year)
    }else if(accPeriod < 0 ){
        accPeriod = 0
    }else{
        accPeriod = retireForm.retireAge - retireForm.startAge
    }
    useEffect(()=>{
        enterRetirePlan()
    },[retireForm])

    async function enterRetirePlan(e) {
        setDrawdownPeriod(retireForm.lifeExp - retireForm.retireAge)
        setEndInfYear(infData[infData.length-1]?.year) //2020
        setStartInfYear(infData[infData.length - accPeriod]?.year)
        setEndInfValue(infData[infData.length-1]?.value) //2020
        setStartInfValue(infData[infData.length - accPeriod]?.value)
        await setCumInflation((-(startInfValue - endInfValue) / startInfValue)*100)
        await setAnnualInflation(((endInfValue/startInfValue)**(1/accPeriod)-1)*100 )
        await setRealReturns((retireForm.expReturns - annualInflation)/100) //in percentage
        }
    let vRetireFund = (retireForm.retireExpense * drawdownPeriod).toFixed(2)
    let vRetireSaving = ( (retireForm.retireExpense * drawdownPeriod - retireForm.startFund) / accPeriod).toFixed(2)

    let infRetireFund = (retireForm.retireExpense* ((1-(1+realReturns)**(-drawdownPeriod))/realReturns) *(1+realReturns)).toFixed(2)
    let fvStartFund = (retireForm.startFund*((1+realReturns)**accPeriod))
    let reqInfRetireFund = (infRetireFund-fvStartFund)
    let infRetireSavings = ((reqInfRetireFund/(1+realReturns)) / (( ((1+realReturns)**accPeriod) -1)/realReturns) ).toFixed(2)

    function showResult(){
        setShow(true)
    }
    function getResults(){
        enterRetirePlan()
        showResult()

    }
    // const inputRef1 = useRef()
    // const inputRef2 = useRef()
    // const inputRef3 = useRef()
    // const inputRef4 = useRef()
    // const inputRef5 = useRef()
    // const inputRef6 = useRef()
    // function refreshForm(){
    //     setRetireForm(initialState)
    //     // window.location.reload()
    //     inputRef1.current.value = 0
    //     inputRef2.current.value = 0
    //     inputRef3.current.value = 0
    //     inputRef4.current.value = 0
    //     inputRef5.current.value = 0
    //     inputRef6.current.value = 0
    // }

    console.log(infRetireSavings)
    console.log(infRetireFund)
    async function savePlan(e) {
        console.log("hit")
        e.preventDefault()
        try {
            console.log("nope")
            await axios.post("/api/retire/plan", {
                currentFund: retireForm.startFund,
                retireExpense: retireForm.retireExpense,
                currentAge: retireForm.startAge,
                retireAge: retireForm.retireAge,
                accumulationPeriod: accPeriod,
                lifeExpectancy: retireForm.lifeExp,
                investReturn: retireForm.expReturns,
                retireFunds: vRetireFund,
                annualSavings: vRetireSaving,
                infAdjRetireFunds: infRetireFund,
                infAdjAnnualSavings: infRetireSavings,
                entryDate: new Date(),
                userId: user._id,
                annualInflation: annualInflation,
                cumulativeInflation: cumInflation
            })
            console.log("plan saved")
            alert("Plan Saved!")
            history.push("/")
        }catch (e){
            alert("Retirement Plan already exists, please access in profile page.")
            console.log(e)
    }
    }

    return (
        <Row>
            <h3 className="col-12 mt-3 text-center titleStyle ">Retirement Planner</h3>
            <Col className="">
                <Row >
                    <Col className="inputDesc col-5 col-md-5 text-end mt-1">Current Retirement Fund:</Col>
                        <input className="inputText col-6 col-md-6 mb-3 "  name="startFund" type="number" placeholder="Enter funds allocated for retirement" min="0" onChange={handleChange} />
                    <Col className="inputDesc col-5 col-md-5 text-end mt-1">Retirement Expense:</Col>
                        <input className="inputText col-6 col-md-6 mb-3" name="retireExpense" type="number" placeholder="Enter desired annual retirement expense" min="0" onChange={handleChange} />
                    <Col className="inputDesc col-5 col-md-5 text-end mt-1">Current Age:</Col>
                        <input className="inputText col-6 col-md-6 mb-3" name="startAge" type="number" placeholder="Enter current age" min="0" onChange={handleChange} />
                    <Col className="inputDesc col-5 col-md-5 text-end mt-1">Retirement Age:</Col>
                        <input className="inputText col-6 col-md-6 mb-3" name="retireAge" type="number" placeholder="Enter targeted retirement age" min="0" onChange={handleChange}/>
                    <Col className="inputDesc col-5 col-md-5 text-end mt-1">Life Expectancy:</Col>
                        <input className="inputText col-6 col-md-6 mb-3" name="lifeExp" type="number" placeholder="Reference family history for accuracy" min="0" onChange={handleChange} />
                    <Col className="inputDesc col-5 col-md-5 text-end mt-1 ">Expected returns (%):</Col>
                        <input className="inputText col-6 col-md-6 mb-3"  name="expReturns" type="number" placeholder="0.05% if left blank (assumed at base i/r)" min="0" onChange={handleChange} />
                    <Col className="col-5 col-md-5 "></Col>
                        {/*{!disabled ?*/}
                            <Button className="col-6 col-md-6 buttonColor" onClick={getResults} >Get Results</Button>
                        {/*//     :*/}
                        {/*//     <Button className="col-3 col-md-3 bg-info " onClick={refreshForm}>Refresh</Button>*/}
                        {/*// }*/}
                </Row>
            </Col>
            {show ?
                <Col className="col-6 col-md-6">
                    <Row>
                        <Col className="col-12 col-md-12 text-center">
                            <Col className="resultHeader">Vanilla Savings</Col>
                            <Row className="d-flex justify-content-center ">
                                <Col className="resultSubheader col-6 col-md-6 text-center my-2 ">Retirement Fund Required:
                                    <input className="result col-5 w-75 col-md-5 text-center mx-3 " name="" type="number" placeholder={vRetireFund} disabled={true}/>
                                </Col>
                                <Col className="resultSubheader col-6 col-md-6 text-center my-2 ">Annual Savings Required:
                                    <input className="result col-5 w-75 col-md-5 text-center mx-3" name="" type="number" placeholder={vRetireSaving} disabled={true}/>
                                </Col>
                            </Row>
                            <Col className="resultHeader mt-5">Inflation Adjusted Savings</Col>
                            <Row className="d-flex justify-content-center ">
                                <Col className="resultSubheader col-6 col-md-6 text-center my-1 ">Retirement Fund Required:
                                    <input className="result col-5 w-75 col-md-5 text-center mx-3 " name="" type="number" placeholder={infRetireFund} disabled={true}/>
                                </Col>
                                <Col className="resultSubheader col-6 col-md-6 text-center my-1">Annual Savings Required:
                                    <input className="result col-5 w-75 col-md-5 text-center mx-3" name="" type="number" placeholder={infRetireSavings} disabled={true}/>
                                </Col>
                            </Row>
                            {user ?
                                <Button className="mt-md-5 w-50 mb-5 buttonColor" onClick={savePlan} onSubmit={savePlan}>Save Retirement
                                    Plan</Button>
                                :
                                <></>
                            }
                        </Col>
                    </Row>
                </Col>
                :
                <></>
            }


            {show ?
                <Row className="mx-5 mb-5 border-dark robotoLight">
                    <h5 className="headerSummary mt-5">Summary:</h5>
                    <div className="textArea col-11">
                    <p className="my-1">You have accumulation period of <b>{accPeriod} years</b> to save up for retirement.</p>
                    <p className="my-1">Over the past {accPeriod} years, from {startInfYear} to {endInfYear} cumulative inflation
                        was <b>{cumInflation.toFixed(2)}%</b> with <b>{annualInflation.toFixed(2)}%</b> annual inflation.</p>
                        <p className="my-1">Projection above was made at annual growth rate of <b>{(realReturns*100).toFixed(2)}%</b> by deducting past annual inflation rate from expected returns of <b>{retireForm.expReturns}%</b> .</p>
                    <p className="disclaimer mb-2">(Past inflation are for projection purpose only and may not accurately indicate future
                        inflationary numbers. This is simply an attempt to provide increased accuracy for long term financial planning.)</p>
                    </div>
                </Row>
                :
                <></>
            }
        </Row>

    )
        ;
}

export default RetirePlan;
