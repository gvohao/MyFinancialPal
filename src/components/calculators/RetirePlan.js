import React, {useEffect, useState, useRef} from 'react';
import {Col, Row, Button} from "react-bootstrap";
import * as singstat from "./singstatjson.json"
import {isNumber} from "chart.js/helpers";

function RetirePlan(props) {

    const initialState = { startFund: 0, retireExpense: 0, retireAge: 0, startAge: 0, lifeExp: 0, expReturns: 0.05}
    const [retireForm, setRetireForm] = useState(initialState)
    // const [accPeriod, setAccPeriod] = useState(0)
    function handleChange(e) {
        setRetireForm({...retireForm, [e.target.name] : e.target.value})
        // getResults()
    }

    console.log(retireForm.retireAge)
    console.log(retireForm.startAge)
    console.log(retireForm.startFund)

    const [drawdownPeriod, setDrawdownPeriod] = useState(0)
    const [startInfYear, setStartInfYear] = useState(0)
    const [endInfYear, setEndInfYear] = useState(0)
    const [startInfValue, setStartInfValue] = useState(0)
    const [endInfValue, setEndInfValue] = useState(0)
    const [cumInflation, setCumInflation] = useState(0)
    const [annualInflation, setAnnualInflation] = useState(0)
    const [realReturns, setRealReturns] = useState(0)
    const [disabled, setDisabled] = useState(false)
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
    console.log(disabled)
    let accPeriod = 0;
    if(accPeriod > data[data.length-1].year - data[0].year){
        accPeriod = (data[data.length-1].year - data[0].year)
    }else if(accPeriod < 0 ){
        accPeriod = 0
    }else{
        accPeriod = retireForm.retireAge - retireForm.startAge
    }

    console.log(data[data.length-1].year - data[0].year)
    // let accPeriod = 0
    useEffect(()=>{
        getResults()
    },[retireForm])

    async function getResults(e) {
        setDrawdownPeriod(retireForm.lifeExp - retireForm.retireAge)
        setEndInfYear(infData[infData.length-1]?.year)
        setStartInfYear(infData[infData.length - accPeriod]?.year)
        setEndInfValue(infData[infData.length-1]?.value)
        setStartInfValue(infData[infData.length - accPeriod]?.value)
        await setCumInflation((-(startInfValue - endInfValue) / startInfValue)*100)
        await setAnnualInflation(((endInfValue/startInfValue)**(1/accPeriod)-1)*100 )
        setRealReturns(retireForm.expReturns - annualInflation)

    }
    function disableButton(){
        setDisabled(true)
    }
    const inputRef1 = useRef()
    const inputRef2 = useRef()
    const inputRef3 = useRef()
    const inputRef4 = useRef()
    const inputRef5 = useRef()
    const inputRef6 = useRef()

    function refreshForm(){
        setRetireForm(initialState)
        // window.location.reload()
        inputRef1.current.value = 0
        inputRef2.current.value = 0
        inputRef3.current.value = 0
        inputRef4.current.value = 0
        inputRef5.current.value = 0
        inputRef6.current.value = 0
        setDisabled(false)
    }
    console.log(realReturns)
    let cumInflation1 = (-(startInfValue - endInfValue) / startInfValue)*100
    console.log(cumInflation1)
    console.log(`cumInflation ${cumInflation} from ${startInfYear} (${startInfValue}) to ${endInfYear} (${endInfValue})`)
    let annualInflation1 = (endInfValue/startInfValue)**(1/accPeriod)-1 // CAGR = (FV-PV)^1/n -1
    console.log(`annualInflation1 ${annualInflation1}`)
    console.log(`annualInflation ${annualInflation}`)

    let abc= 1234

    return (
        <Row>
            <h1>{accPeriod}</h1>
            <h5>cumInf={cumInflation} annInf={annualInflation} realReturns={realReturns}</h5>
            <h3 className="col-12 mt-3 mb-5 text-center">Retirement Planner</h3>
            <Col className="col-6">
                <Row >
                    <Col className="col-5 col-md-5 text-end mt-1">Current Retirement Fund:</Col>
                        <input ref={inputRef1} className="col-7 col-md-7 mb-3"  name="startFund" type="number" placeholder="Enter funds allocated for retirement" onChange={handleChange} />
                    <Col className="col-5 col-md-5 text-end mt-1">Retirement Expense:</Col>
                        <input ref={inputRef2} className="col-7 col-md-7 mb-3" name="retireExpense" type="number" placeholder="Enter desired annual retirement expense" onChange={handleChange} />
                    <Col className="col-5 col-md-5 text-end mt-1">Current Age:</Col>
                        <input ref={inputRef3} className="col-7 col-md-7 mb-3" name="startAge" type="number" placeholder="Enter current age" onChange={handleChange} />
                    <Col className="col-5 col-md-5 text-end mt-1">Retirement Age:</Col>
                        <input ref={inputRef4} className="col-7 col-md-7 mb-3" name="retireAge" type="number" placeholder="Enter targeted retirement age" onChange={handleChange}/>
                    <Col className="col-5 col-md-5 text-end mt-1">Life Expectancy:</Col>
                        <input ref={inputRef5} className="col-7 col-md-7 mb-3" name="lifeExp" type="number" placeholder="Enter life expectancy (reference family history)" onChange={handleChange} />
                    <Col className="col-5 col-md-5 text-end mt-1">Expected returns (%):</Col>
                        <input ref={inputRef6} className="col-7 col-md-7 mb-3"  name="expReturns" type="number" placeholder="Assumed at 0.05% bank savings interests if left blank" onChange={handleChange} />
                    <Col className="col-5 col-md-5 "></Col>
                        {!disabled ?
                            <Button className="col-7 col-md-7" onClick={getResults && disableButton}>Get Results</Button>
                            :
                            <Button className="col-3 col-md-3 bg-info " onClick={refreshForm}>Refresh</Button>
                        }
                </Row>
            </Col>
            {disabled ?
                <Col className="col-6 col-md-6">
                    <Row>
                        <Col className="col-12 col-md-12 text-center ">Vanilla Savings
                            <Row className="d-flex justify-content-center ">
                                <Col className="col-6 col-md-6 text-center my-2 ">Retirement Fund Required:</Col>
                                <Col className="col-6 col-md-6 text-center my-2 ">Annual Savings Required:</Col>
                                <input className="col-5 col-md-5 text-center mx-3 " name="" type="number"
                                       placeholder={abc} disabled={true}/>
                                <input className="col-5  col-md-5 text-center mx-3" name="" type="number"
                                       placeholder={abc} disabled={true}/>
                            </Row>
                            <Col className="mt-5">Inflation Adjusted Savings</Col>
                            <Row className="d-flex justify-content-center ">
                                <Col className="col-6 col-md-6 text-center my-1 ">Retirement Fund Required:</Col>
                                <Col className="col-6 col-md-6 text-center my-1">Annual Savings Required:</Col>
                                <input className="col-5 col-md-5 text-center mx-3 " name="" type="number"
                                       placeholder={abc} disabled={true}/>
                                <input className="col-5  col-md-5 text-center mx-3" name="" type="number"
                                       placeholder={abc} disabled={true}/>
                            </Row>
                            <Button className="mt-md-5 w-50">Save Retirement Plan</Button>
                        </Col>
                    </Row>
                </Col>
                :
                <></>
            }
        </Row>
    )
        ;
}

export default RetirePlan;
