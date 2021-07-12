import React, { useState } from 'react';
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import * as singstat from "./singstatjson.json"

function RetirementPlanner({user}) {
    const [currentFund, setCurrentFund] = useState(0)
    const [retireExpense, setRetireExpense] = useState(0)
    const [currentAge, setCurrentAge] = useState(0)
    const [retireAge, setRetireAge] = useState(0)
    const [lifeExpectancy, setLifeExpectancy] = useState(0)
    const [investReturn, setInvestReturn] = useState(0.05)

    // const handleChange = (e) => {
    //     setPrevState({...prevState, [e.target.name]: e.target.value})
    // }
    // console.log(currentFund)
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

    const [startInflationYear, setStartInflationYear] = useState(0)
    const [cumulativeInflation, setCumulativeInflation] = useState(0)
    const [annualInflation, setAnnualInflation] = useState(0)
    const [showResult, setShowResult] = useState(false)

    let data = singstat.default.Level1

    let accumulationPeriod = retireAge - currentAge // cannot be more than 59years
    if(accumulationPeriod > 59){
        accumulationPeriod = 59
    }
    let backtraceFrom = data.length - 3 //last index of json
    let currentYearInflation = data[backtraceFrom].year
    let startInfIndex = backtraceFrom-(accumulationPeriod * 3)
    // let inflationStart = data[backtraceFrom-(accumulationPeriod * 3)].value
    let inflationEnd = data[backtraceFrom].value // remove -3 for latest

    async function getRetirePlan(e) { //make this show results on click
        setStartInflationYear(data[startInfIndex].year) //backtrace to X years before
        let inflationStart = data[backtraceFrom-(accumulationPeriod * 3)].value
        setCumulativeInflation(((inflationEnd - inflationStart) / inflationStart) * 100)
        setAnnualInflation(((inflationEnd / inflationStart)**(1/(currentYearInflation-startInflationYear)))-1)

    }
    const [results, setResults] = useState({})
    async function getResults(e){
        setShowResult(true)
        setResults({})
        let growthRate = Math.abs(investReturn/100)
        console.log(`investment return ${investReturn}`)
        console.log(`growth rate ${growthRate}`)
        console.log(`annual inflation ${annualInflation}`)
        let discountRate = (growthRate - annualInflation)  //R real returns
        console.log(`discount rate ${discountRate}`)
        let drawdownPeriod = lifeExpectancy - retireAge //N

        let retireFunds = 0
        let annualSavings = 0
        let infAdjRetireFunds = 0
        let presentValueRetireFunds = 0
        let infAdjAnnualSavings = 0
        let presentValueSavingsRequired = 0

        //vanilla savings
        retireFunds = retireExpense*drawdownPeriod-currentFund
        annualSavings = (retireExpense*drawdownPeriod-currentFund)/accumulationPeriod

        infAdjRetireFunds = retireExpense *((1-(1+discountRate)**(-drawdownPeriod))/+discountRate)//PV/FV at retirement age (Ordinary Annuity)
        //PV = PMT((1-(1+r)^-n)/r)
        presentValueRetireFunds = infAdjRetireFunds*(1/(1+discountRate)**accumulationPeriod)
        console.log(presentValueRetireFunds)

        presentValueSavingsRequired = presentValueRetireFunds - currentFund

        if(presentValueRetireFunds - currentFund > 0){
            presentValueSavingsRequired = presentValueRetireFunds - currentFund
        } else{
            presentValueSavingsRequired = 0
        }

        infAdjAnnualSavings = presentValueSavingsRequired/(((1-(1+discountRate)**-accumulationPeriod)/discountRate)) //PMT (Ordinary Annuity)
        // let infAdjAnnualSavings = infAdjRetireFunds/(((1+growthRate)**accumulationPeriod-1)/growthRate) //PMT (Ordinary Annuity)
        //PMT = (FV/((1+r)^n-1)/r)
        console.log(`infAdjFund =${infAdjRetireFunds} growthrate =${growthRate} accperiod =${accumulationPeriod}`)
        console.log(user)
        await setResults(prevState => ({...prevState,
            retireFunds: retireFunds,
            annualSavings: annualSavings,
            infAdjRetireFunds: infAdjRetireFunds,
            presentValueRetireFunds: presentValueRetireFunds,
            presentValueSavingsRequired: presentValueSavingsRequired,
            infAdjAnnualSavings: infAdjAnnualSavings,
            entryDate: new Date.now(),
            // displayName:
        }))
    }

    let growthRate = Math.abs(investReturn/100)

    console.log(`investment return ${investReturn}`)
    console.log(`growth rate ${growthRate}`)
    console.log(`annual inflation ${annualInflation}`)
    let discountRate = (growthRate - annualInflation)  //R real returns
    console.log(`discount rate ${discountRate}`)
    let drawdownPeriod = lifeExpectancy - retireAge //N

    //vanilla savings
    let retireFunds = retireExpense*drawdownPeriod-currentFund
    let annualSavings = (retireExpense*drawdownPeriod-currentFund)/accumulationPeriod

    let infAdjRetireFunds = retireExpense *((1-(1+discountRate)**(-drawdownPeriod))/+discountRate)//PV/FV at retirement age (Ordinary Annuity)
    //PV = PMT((1-(1+r)^-n)/r)
    let presentValueRetireFunds = infAdjRetireFunds*(1/(1+discountRate)**accumulationPeriod)
    console.log(presentValueRetireFunds)

    let presentValueSavingsRequired = presentValueRetireFunds - currentFund
    let infAdjAnnualSavings = presentValueSavingsRequired/(((1-(1+discountRate)**-accumulationPeriod)/discountRate)) //PMT (Ordinary Annuity)
    console.log(-accumulationPeriod)

    // let infAdjAnnualSavings = infAdjRetireFunds/(((1+growthRate)**accumulationPeriod-1)/growthRate) //PMT (Ordinary Annuity)
    //PMT = (FV/((1+r)^n-1)/r)
    console.log(`infAdjFund =${infAdjRetireFunds} growthrate =${growthRate} accperiod =${accumulationPeriod}`)

    async function savePlan(e){
        e.preventDefault()
        try{
            await axios.post("/api/portfolio/plan", {
                currentFund: currentFund,
                retireExpense: retireExpense,
                currentAge: currentAge,
                retireAge: retireAge,
                lifeExpectancy: lifeExpectancy,
                investReturn: investReturn,
                retireFunds: retireFunds,
                annualSavings: annualSavings,
                infAdjRetireFunds: infAdjRetireFunds,
                infAdjAnnualSavings: infAdjAnnualSavings,

            })
            alert("Plan Saved!")
        }catch(e){
            console.log(e)
        }
    }

    return (
        <Row className="retirementplanning  justify-content-center">
            <Col className="col-12 text-center mt-3 mb-3"><h5 >Retirement Planner</h5></Col>
            <Col className="col-md-7 mt-3">
                    <Row>
                        <Col className="col-12 col-md-12">
                            <Row className="align-items-center">
                                <Col className="col-6 text-lg-end">
                                    <label>Current Retirement Fund:</label>
                                </Col>
                                    <input className="text-start w-50 px-1" required type="number" name="currentFund" placeholder="Current retirement fund" min={1} onChange={changeCurrentFund } />
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
                                    <label>Current Age:</label></Col>
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
            <Col className="col-12 mt-5 fw-bold">Report:</Col>
            <Col className="col-12 ">You have {accumulationPeriod} years to accumulate your retirement funds.
                Over the past {accumulationPeriod} years from {startInflationYear} to {currentYearInflation},
                cumulative inflation was {cumulativeInflation}% with annual inflation of {annualInflation}.
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
