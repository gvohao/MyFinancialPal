import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useHistory} from "react-router-dom";
import {logDOM} from "@testing-library/react";
import Quote from "./Quote";
import {Row, Col, Form, Button} from "react-bootstrap";

function Port({user}) {
    const [retirePlan, setRetirePlan] = useState([])
    const [entryYear, setEntryYear] = useState([])
    const [entryMonth, setEntryMonth] = useState([])
    let history = useHistory()

    console.log(user)
    useEffect(() =>{
        if(user.retirementPlan === null){
            history.push('/')
        }
        console.log("end")
        console.log(user)
        if(user._id){
            showRetire()
            // console.log(user.retirementPlan._id)
        }

    },[user])

    async function showRetire() {
        try{
            let res = await axios.get(`/api/user/${user._id}`) //hit this route from /this component page
            console.log(res.data.user.retirementPlan)
            console.log(user._id)
            setRetirePlan(res.data.user.retirementPlan)
            let entryDate = res.data.user.retirementPlan.entryDate.split("-")
            setEntryYear(entryDate[0])
            setEntryMonth(entryDate[1])
        }catch(err){
            console.log(err)
        }
    }

    const [newRetireExpense, setNewRetireExpense] = useState(user.retirementPlan.retireExpense)
    const [newRetireAge, setNewRetireAge] = useState(user.retirementPlan.retireAge)
    const [newLifeExpectancy, setNewLifeExpectancy] = useState(user.retirementPlan.lifeExpectancy)
    const [newInvestReturn, setNewInvestReturn] = useState(user.retirementPlan.investReturn)

    function changeRetireExpense(e){
        setNewRetireExpense(e.target.value)
    }
    function changeRetireAge(e){
        setNewRetireAge(e.target.value)
    }
    function changeLifeExpectancy(e){
        setNewLifeExpectancy(e.target.value)
    }
    function changeInvestReturn(e){
        setNewInvestReturn(e.target.value)
    }
    let annualInflation = (retirePlan.annualInflation*100) //annual inflation in %
    console.log(annualInflation)
    console.log(retirePlan.investReturn)
    let discountRate = (retirePlan.investReturn - annualInflation) // discount rate in %

    let drawdownPeriod = retirePlan.lifeExpectancy - retirePlan.retireAge
    let accumulationPeriod = retirePlan.retireAge - retirePlan.currentAge

    console.log(retirePlan.retireExpense *((1-(1+(discountRate/100))**(-drawdownPeriod))/(discountRate/100)))
    let infAdjRetireFunds = retirePlan.retireExpense *((1-(1+(discountRate/100))**(-drawdownPeriod))/(discountRate/100))//PV/FV at retirement age (Ordinary Annuity)
    let presentValueRetireFunds = infAdjRetireFunds*(1/(1+(discountRate/100))**accumulationPeriod)
    let presentValueSavingsRequired = presentValueRetireFunds - retirePlan.currentFund
    let infAdjAnnualSavings = presentValueSavingsRequired/(((1-(1+(discountRate/100))**-accumulationPeriod)/(discountRate/100)))
    console.log(user.retirementPlan._id)

    async function changeGoal(e){
        e.preventDefault()
        try{
            console.log(user.retirementPlan._id)
            await axios.put(`/api/retire/edit/${user.retirementPlan._id}`,{
                retireExpense: newRetireExpense,
                retireAge: newRetireAge,
                lifeExpectancy: newLifeExpectancy,
                investReturn: newInvestReturn,
                accumulationPeriod: newRetireAge-retirePlan.currentAge,
                retireFunds: newRetireExpense*(newLifeExpectancy-newRetireAge)-retirePlan.currentFund,
                annualSavings: newRetireExpense*(newLifeExpectancy-newRetireAge)/(newRetireAge-retirePlan.currentAge),
                // retirePlan.retireExpense *((1-(1+(discountRate/100))**(-drawdownPeriod))/(discountRate/100)),
                infAdjRetireFunds: newRetireExpense*((1-(1+((newInvestReturn-annualInflation)/100))**(-(newLifeExpectancy-newRetireAge)))/((newInvestReturn-annualInflation)/100)),
                infAdjAnnualSavings: (newRetireExpense*((1-(1+((newInvestReturn-annualInflation)/100))**(-(newLifeExpectancy-newRetireAge)))/((newInvestReturn-annualInflation)/100)))*(1/(1+(discountRate/100))**(newRetireAge-retirePlan.currentAge))-retirePlan.currentAge/(((1-(1+(discountRate/100))**-accumulationPeriod)/(discountRate/100)))    //presentValueRetireFunds
                    //PMT of PV=(presentValueRetireFunds - currentFund )
            })
            history.push("/")
            console.log("changed goal!")
            alert("Goals changed!")
            // console.log(res.data.retirePlan.investReturn)
        }catch(e){
            console.log(e)
        }
    }

    const [clickedEdit, setClickedEdit] = useState(false)
    function showChangeGoal() {
        setClickedEdit(true)
    }

    async function deletePlan(e){
        e.preventDefault()
        try{
            console.log("delete function")
            await axios.delete(`/api/user/delete/${user._id}`)
            // await axios.delete(`/api/retire/delete/${user.retirementPlan._id}`)
            // user.retirementPlan = []
            console.log(`deleted ${user.retirementPlan}`)
            history.push(`/`)
        }catch (e){
            console.log(e)
        }
    }
    return (

        <Row>
            <h3 className="text-primary col-lg-12 ">According to your plans...</h3>
            <Col className="card col-6 " >
                <div className="card-body champagne">
                    <h5 className="card-title text-center">Retirement</h5>
                    <Row>
                        <p className="card-text col-sm-7 text-end">Retirement expense:</p>
                        <p className="card-text col">${retirePlan.retireExpense}/year</p>
                    </Row>
                    <Row>
                        <p className="card-text col-sm-7 text-end">Funds allocated as of ({entryYear}/{entryMonth}):</p>
                        <p className="card-text col">${retirePlan.currentFund}</p>
                    </Row>
                    <Row>
                        <p className="card-text col-sm-7 text-end">Retirement age:</p>
                        <p className="card-text col">Retirement age: {retirePlan.retireAge}</p>
                    </Row>
                    <Row>
                        <p className="card-text col-sm-7 text-end">Inflation adjusted funds:</p>
                        <p className="card-text col">${infAdjRetireFunds}</p>
                    </Row>
                    <Row>
                        <p className="card-text col-sm-7 text-end">Inflation adjusted savings (annual):</p>
                        <p className="card-text col-5">${infAdjAnnualSavings}</p>
                    </Row>
                    <p className="card-text mt-3">Assumptions: {retirePlan.investReturn}% investment returns @ {annualInflation}% p.a.
                                                real returns of {discountRate}%</p>
                    <div className="row">
                    <Button className="btn btn-success w-50 mt-2" onClick={showChangeGoal}>Edit</Button>
                    <Button className="btn btn-danger w-50 mt-2" onClick={deletePlan}>Delete</Button>
                    </div>
                </div>
            </Col>
            {clickedEdit ?
                <Form className="col-5 px-5">
                    <Form.Label>Change expected retirement expense:</Form.Label>
                    <Form.Control onChange={changeRetireExpense} placeholder={retirePlan.retireExpense}></Form.Control>
                    <Form.Label> Change desired retirement age:</Form.Label>
                    <Form.Control onChange={changeRetireAge} placeholder={retirePlan.retireAge}></Form.Control>
                    <Form.Label>Change target death date:</Form.Label>
                    <Form.Control onChange={changeLifeExpectancy} placeholder={retirePlan.lifeExpectancy}></Form.Control>
                    <Form.Label>Change expected investment returns:</Form.Label>
                    <Form.Control onChange={changeInvestReturn} placeholder={retirePlan.investReturn}></Form.Control>
                    <Button className="btn btn-primary w-100 mt-2" onClick={changeGoal}>Edit</Button>
                </Form>
                :
                <></>
            }

        </Row>
    );
}

export default Port;
// async function showRetire() {
//     try {
//         console.log("showretire fail")
//         let userId = `${user?._id}`
//         // console.log(userId)
//         let res = await axios.get(`/api/user/${userId}`) //hit this route from /this component page
//         // let res = await axios.get(`/api/user/60e945871052ef1081201521`) //hit this route from /this component page
//         console.log("showretire fail")
//         console.log(res.data.user.retirementPlan)
//         console.log(user._id)
//         // setRetirePlan(res.data.user.retirementPlan)
//         setRetirePlan([res.data.user.retirementPlan])
//     } catch (e) {
//         console.log(e)
//     }
// }
// console.log([user.retirementPlan])
