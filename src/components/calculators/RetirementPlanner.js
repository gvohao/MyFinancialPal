import React, {useState} from 'react';
import {Col, Row } from "react-bootstrap";
import axios from "axios";

function RetirementPlanner(props) {
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
    }

    function changeRetireAge(e){
        setRetireAge(e.target.value)
    }

    function changeLifeExpectancy(e){
        setLifeExpectancy(e.target.value)
    }

    function changeInvestReturn(e){

        setInvestReturn(e.target.value)
    }

    let accumulationPeriod = retireAge - currentAge

    let cpiUrl ="https://www.tablebuilder.singstat.gov.sg/publicfacing/api/json/title/16842.json"
    const [startInflationYear, setStartInflationYear] = useState(0)
    const [currentInflationYear, setCurrentInflationYear] = useState(0)
    const [cumulativeInflation, setCumulativeInflation] = useState(0)
    const [annualInflation, setAnnualInflation] = useState(0)

    // let currentInflationYear;
    // let startInflationYear;
    async function getRetirePlan(e) {
        let res = await axios.get(cpiUrl)
        let data = res.data.Level1
        let backtraceFrom = data.length - 3 //last index of json
        setStartInflationYear(data[backtraceFrom-(accumulationPeriod * 3)].year) //backtrace to X years before
        setCurrentInflationYear(data[backtraceFrom].year)
        // const date = new Date()
        // let currentYear = date.getFullYear()
        // let endInflationYear = currentYear
        let inflationStart = data[backtraceFrom-(accumulationPeriod * 3)].value
        let inflationEnd = data[backtraceFrom].value // remove -3 for latest
        setCumulativeInflation(((inflationEnd - inflationStart) / inflationStart) * 100)
        setAnnualInflation(((inflationEnd / inflationStart)**(1/(currentInflationYear-startInflationYear)))-1)
    }
    // let retireSavings = //PMT
    // let totalRetirementFund = currentFund + retireSavings //PV
    // let discountRate = investReturn - annualInflation //R
    // let drawdownPeriod = lifeExpectancy - retireAge //N
    // let moneyAtEnd = 0
    // FIND PV WHEN FV=0

    // retireExpense //C

    // let growthRate = 0;
    // if(investReturn === 0){
    //     growthRate = 0
    // }else{
    //     growthRate = investReturn/100
    // }
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


    // let retireFunds = retireExpense*drawdownPeriod
    // let annualSavings = (retireExpense*drawdownPeriod-currentFund)/accumulationPeriod

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
                                <input className="text-start w-50 px-1" required  type="number" name="currentRetirementFund" placeholder="Current retirement fund" onChange={changeCurrentFund} />
                        </Row>

                        <Row className="align-items-center mt-1">
                            <Col className="col-6 col-md-6 text-lg-end">
                                <label>Desired Annual Retirement Expenses:</label>
                            </Col>
                                <input className="text-start w-50 px-1" type="number" name="retireExpense" placeholder="Annual expenses in retirement" onChange={changeRetireExpense} />
                        </Row>
                        <Row className="align-items-center mt-1">
                            <Col className="col-6 col-md-6 text-lg-end">
                                <label>Target Retirement Age:</label></Col>
                                <input className="text-start w-50 px-1" type="number" name="retireAge" placeholder="Target retirement age" onChange={changeRetireAge} />
                        </Row>
                        <Row className="align-items-center mt-1">
                            <Col className="col-6 col-md-6 text-lg-end">
                                <label>Current Age:</label></Col>
                                <input className="text-start w-50 px-1" type="number" name="currentAge" placeholder="Current age" onChange={changeCurrentAge} />
                        </Row>
                        <Row className="align-items-center mt-1">
                            <Col className="col-6 col-md-6 text-lg-end">
                                <label>Life Expectancy:</label></Col>
                                <input className="text-start w-50 px-1"  type="number" name="lifeExpectancy" placeholder="Life expectancy" onChange={changeLifeExpectancy} />
                        </Row>
                        <Row className="align-items-center mt-1">
                            <Col className="col-6 col-md-6 text-lg-end">
                                <label>Expected Investment Return: </label></Col>
                                <input className="text-start w-50 px-1"  type="number" name="expectedReturns" placeholder="Assumed at 0.05% prevailing bank i/r." onChange={changeInvestReturn} />
                        </Row>
                        <Row className="text-center mt-4 ">
                            <Col className="col-6 col-md-6"></Col>
                            <Col className="">
                                <button className="btn-primary w-100 " onClick={getRetirePlan}>Save Goal</button>
                            </Col>
                        </Row>
                    </Col>

                </Row>
            </Col>

            <Col className="col-5 ">
                <Row className=" d-flex justify-content-center">
                    <Col className="col-12 col-md-12 text-center">
                        <label>Retirement Fund Required:</label></Col>
                    <Col className="col-8 col-md-8 text-center">
                        <Col>${retireFunds}</Col>
                        {/*<input className="text-center w-50" type="number" name="mthlySavings" placeholder="Return amount" />*/}
                    </Col>
                </Row>
                <Row className="mt-3 d-flex justify-content-center">
                    <Col className="col-12 col-md-12 text-center">
                        <label>Annual Savings Required</label></Col>
                    <Col className="col-8 col-md-8 text-center">
                        <Col>${annualSavings}/year</Col>
                        {/*<input className="text-center w-50" type="number" name="mthlySavings" placeholder="Return amount" />*/}
                    </Col>
                </Row>
                <Row className="mt-3 d-flex justify-content-center">
                    <Col className="col-12 col-md-12 text-center">
                        <label>Inflation Adjusted Retirement Fund Required</label></Col>
                    <Col className="col-8 col-md-8 text-center">
                        <Col>${infAdjRetireFunds}</Col>
                        {/*<input className="text-center w-50" type="number" name="mthlySavings" placeholder="Return amount" />*/}
                    </Col>
                </Row>
                <Row className="mt-3 d-flex justify-content-center">
                    <Col className="col-12 col-md-12 text-center">
                        <label>Inflation Adjusted Annual Savings</label></Col>
                    <Col className="col-8 col-md-8 text-center">
                        <Col>${infAdjAnnualSavings}</Col>
                        {/*<input className="text-center w-50" type="number" name="adjSavings" placeholder="Return amount" />*/}
                    </Col>
                </Row>
            </Col>
            <Col className="col-12 mt-5 fw-bold">Report:</Col>
            <Col className="col-12 ">You have {accumulationPeriod} years to accumulate your retirement funds. {startInflationYear} to {currentInflationYear}, cumulative inflation was {cumulativeInflation}% with annual inflation of {annualInflation}
                {/*Over the past {accumulationPeriod} years, from {startInflationYear} to {currentInflationYear} (last available CPI number),*/}
                {/*cumulative inflation was {cumulativeInflation}%.*/}
            </Col>
        </Row>
)
    ;
}

export default RetirementPlanner;
