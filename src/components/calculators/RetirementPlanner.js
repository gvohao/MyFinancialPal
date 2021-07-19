import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import axios from "axios";
import * as singstat from "./singstatjson.json"
import Quote from "../general/Quote";

function RetirementPlanner({user}) {
    const [currentFund, setCurrentFund] = useState(0)
    const [retireExpense, setRetireExpense] = useState(0)
    const [currentAge, setCurrentAge] = useState(0)
    const [retireAge, setRetireAge] = useState(0)
    const [lifeExpectancy, setLifeExpectancy] = useState(0)
    const [investReturn, setInvestReturn] = useState(0.05)

    function changeCurrentFund(e) {
        setCurrentFund(e.target.value)
    }
    function changeRetireExpense(e) {
        setRetireExpense(e.target.value)
    }
    function changeCurrentAge(e){
        setCurrentAge(e.target.value)
        // getRetirePlan()
    }
    function changeRetireAge(e){
        setRetireAge(e.target.value)
        getRetirePlan()
    }
    function changeLifeExpectancy(e){
        setLifeExpectancy(e.target.value)
        getRetirePlan()
    }
    function changeInvestReturn(e){
        setInvestReturn(e.target.value)
    }

    let data = singstat.default.Level1

    let accumulationPeriod = retireAge - currentAge // cannot be more than 59years
    if(accumulationPeriod > data[data.length-1].year-data[0].year){
        accumulationPeriod = data[data.length-1].year-data[0].year
    }
    if(accumulationPeriod < 0){
        accumulationPeriod = 0
    }

    const [startInflationYear, setStartInflationYear] = useState(0)
    const [cumulativeInflation, setCumulativeInflation] = useState(0)
    const [annualInflation, setAnnualInflation] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [backtraceFrom, setBacktraceFrom] = useState(0)
    const [currentYearInflation, setCurrentYearInflation] = useState(0)

    async function getRetirePlan(e) { //make this show results on click
        await setBacktraceFrom(data.length - 3) //last index of json
        await setCurrentYearInflation(data[backtraceFrom].year)
        let startInfIndex = backtraceFrom-(accumulationPeriod * 3)
        await setStartInflationYear(data[startInfIndex]?.year) //backtrace to X years before
        let inflationStart = data[backtraceFrom-(accumulationPeriod * 3)]?.value
        let inflationEnd = data[backtraceFrom]?.value // remove -3 for latest
        setCumulativeInflation(((inflationEnd - inflationStart) / inflationStart) * 100)
        setAnnualInflation(((inflationEnd / inflationStart)**(1/(currentYearInflation-startInflationYear)))-1)
    }

    const [results, setResults] = useState({})

    let growthRate = Math.abs(investReturn/100) //growth rate in decimals

    async function getResults(e){
        setShowResult(true)
        setResults({})
        let discountRate = (growthRate - annualInflation)  //R real returns in decimals
        let drawdownPeriod = lifeExpectancy - retireAge //N

        let retireFunds = 0
        let annualSavings = 0
        //vanilla savings
        retireFunds = retireExpense*drawdownPeriod-currentFund
        annualSavings = (retireExpense*drawdownPeriod-currentFund)/accumulationPeriod
        cumulativeInflation.toFixed(2) //does not work yet
        await setResults(prevState => ({...prevState,
            retireFunds: retireFunds,
            annualSavings: annualSavings,
            presentValueRetireFunds: presentValueRetireFunds,
            presentValueSavingsRequired: presentValueSavingsRequired,
            infAdjRetireFunds: infAdjRetireFunds,
            infAdjAnnualSavings: infAdjAnnualSavings,
        }))
    }
    let inflationPercent = (annualInflation*100).toFixed(2)

    let discountRate = (growthRate - annualInflation)  //R real returns
    let drawdownPeriod = lifeExpectancy - retireAge //N

    //vanilla savings
    let retireFunds = retireExpense*drawdownPeriod-currentFund
    let annualSavings = (retireExpense*drawdownPeriod-currentFund)/accumulationPeriod

    let infAdjRetireFunds = retireExpense *((1-(1+discountRate)**(-drawdownPeriod))/discountRate)//PV/FV at retirement age (Ordinary Annuity)
    //PV = PMT((1-(1+r)^-n)/r)
    let presentValueRetireFunds = infAdjRetireFunds*(1/(1+discountRate)**accumulationPeriod)
    let presentValueSavingsRequired = presentValueRetireFunds - currentFund
    let infAdjAnnualSavings = presentValueSavingsRequired/(((1-(1+discountRate)**-accumulationPeriod)/discountRate)) //PMT (Ordinary Annuity)

    // let infAdjAnnualSavings = infAdjRetireFunds/(((1+growthRate)**accumulationPeriod-1)/growthRate) //PMT (Ordinary Annuity)
    //PMT = (FV/((1+r)^n-1)/r)
    console.log(`infAdjFund =${infAdjRetireFunds} growthrate =${growthRate} accperiod =${accumulationPeriod}`)

    async function savePlan(e){
        e.preventDefault()
        try{
            await axios.post("/api/retire/plan", {
                currentFund: currentFund,
                retireExpense: retireExpense,
                currentAge: currentAge,
                retireAge: retireAge,
                accumulationPeriod: retireAge - currentAge,
                lifeExpectancy: lifeExpectancy,
                investReturn: investReturn,
                retireFunds: retireFunds,
                annualSavings: annualSavings,
                infAdjRetireFunds: infAdjRetireFunds,
                infAdjAnnualSavings: infAdjAnnualSavings,
                entryDate: new Date(),
                userId: user._id,
                annualInflation:annualInflation,
                cumulativeInflation:cumulativeInflation
            })
            alert("Plan Saved!")
        }catch(e){
            console.log(e)
        }
    }

    return (
        <Row className="retirementplanning  justify-content-center champange ">
            <Col className="col-12 text-center mt-3 mb-3"><h5 >Retirement Planner</h5></Col>
            <Col className="col-md-7 mt-3">
                    <Row>
                        <Col className="col-12 col-md-12">
                            <Row className="align-items-center">
                                <Col className="col-6 text-lg-end">
                                    <label>Current Retirement Fund:</label>
                                </Col>
                                    <input className="text-start w-50 px-1" required type="number" name="currentFund" placeholder="Current retirement fund" min={1} onChange={changeCurrentFund} />
                            </Row>

                            <Row className="align-items-center mt-1">
                                <Col className="col-6 col-md-6 text-lg-end">
                                    <label>Desired Annual Retirement Expenses:</label>
                                </Col>
                                    <input className="text-start w-50 px-1" type="number" name="retireExpense" placeholder="Annual expenses in retirement" min={1} onChange={changeRetireExpense} />
                            </Row>
                            <Row className="align-items-center mt-1">
                                <Col className="col-6 col-md-6 text-lg-end">
                                    <label>Target Retirement Age:</label></Col>
                                    <input className="text-start w-50 px-1" type="number" name="retireAge" placeholder="Target retirement age" min={1} onChange={changeRetireAge} />
                            </Row>
                            <Row className="align-items-center mt-1">
                                <Col className="col-6 col-md-6 text-lg-end">
                                    <label>Current Age:</label> </Col>
                                    <input className="text-start w-50 px-1" type="number" name="currentAge" placeholder="Current age" min={1} onChange={changeCurrentAge} />
                            </Row>
                            <Row className="align-items-center mt-1">
                                <Col className="col-6 col-md-6 text-lg-end">
                                    <label>Life Expectancy:</label></Col>
                                    <input className="text-start w-50 px-1"  type="number" name="lifeExpectancy" placeholder="Life expectancy" min={1} onChange={changeLifeExpectancy} />
                            </Row>
                            <Row className="align-items-center mt-1">
                                <Col className="col-6 col-md-6 text-lg-end">
                                    <label>Expected Investment Return (%): </label></Col>
                                    <input className="text-start w-50 px-1"  type="number" name="investReturn" placeholder="Assumed at 0.05% prevailing bank i/r." min={1} onChange={changeInvestReturn} />
                            </Row>
                            <Row className="text-center mt-4 ">
                                <Col className="col-6 col-md-6"></Col>
                                <Col className="">
                                    <button className="btn-primary w-100 " onClick={getResults}>Get Result</button>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
            </Col>
            {showResult ?
                <Col className="col-5 ">
                    <Row className=" d-flex justify-content-center">
                        <Col className="col-12 col-md-12 text-center">
                            <label>Retirement Fund Required:</label></Col>
                        <Col className="col-8 col-md-8 text-center">
                            <Col>${results.retireFunds}</Col>
                            {/*<input className="text-center w-50" type="number" name="mthlySavings" placeholder="Return amount" />*/}
                        </Col>
                    </Row>
                    <Row className="mt-3 d-flex justify-content-center">
                        <Col className="col-12 col-md-12 text-center">
                            <label>Annual Savings Required</label></Col>
                        <Col className="col-8 col-md-8 text-center">
                            <Col>${results.annualSavings}/year</Col>
                            {/*<input className="text-center w-50" type="number" name="mthlySavings" placeholder="Return amount" />*/}
                        </Col>
                    </Row>
                    <Row className="mt-3 d-flex justify-content-center">
                        <Col className="col-12 col-md-12 text-center">
                            <label>Inflation Adjusted Retirement Fund Required</label></Col>
                        <Col className="col-8 col-md-8 text-center">
                            <Col>${results.infAdjRetireFunds}</Col>
                            {/*<input className="text-center w-50" type="number" name="mthlySavings" placeholder="Return amount" />*/}
                        </Col>
                    </Row>
                    <Row className="mt-3 d-flex justify-content-center">
                        <Col className="col-12 col-md-12 text-center">
                            <label>Inflation Adjusted Annual Savings</label></Col>
                        <Col className="col-8 col-md-8 text-center">
                            <Col>${results.infAdjAnnualSavings}</Col>
                            {/*<input className="text-center w-50" type="number" name="adjSavings" placeholder="Return amount" />*/}
                        </Col>
                    </Row>
                    <Row className="text-center mt-4 ">
                        <Col className="col-12 col-md-12 text-center mt-2"></Col>
                        <Col className="">
                            {user ?
                                <button className="btn-primary w-50 " onClick={savePlan}>Save To Portfolio</button>
                                :
                                <></>
                            }
                        </Col>
                    </Row>
                </Col>
                :
                <></>
            }
            { showResult ?
                <>
            <Col className="col-12 mt-5 fw-bold ">Report:</Col>
            <Col className="col-12 ">You have {accumulationPeriod} years to accumulate your retirement funds.
                Over the past {accumulationPeriod} years from {startInflationYear} to {currentYearInflation},
                cumulative inflation was {cumulativeInflation}% with average annual inflation of {inflationPercent}%.
            </Col>
            </>
            :
            <></>
            }

        </Row>

)
    ;
}

export default RetirementPlanner;
