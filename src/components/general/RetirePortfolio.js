import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Col, Row, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";


function RetirePortfolio({user}) {
    const[retirePlan, setRetirePlan] = useState([])
    const[entryYear, setEntryYear] = useState([])
    const[entryMonth, setEntryMonth] = useState([])
    console.log(user.retirementPlan)
    let history = useHistory()
    useEffect( ()=>{
        if(user.retirementPlan === null) {
            history.push("/")
        } else if(user.retirementPlan){
            showRetire()
        }
    },[user])

    async function showRetire() {
        console.log("showretire")
        try{
            let res = await axios.get(`/api/retire/${user.retirementPlan._id}`) //hit this route from /this component page
            setRetirePlan(res.data.retirePlan)
            let entryDate = res.data.retirePlan.entryDate.split("-")
            console.log(entryDate)
            // setEntryYear(entryDate[0])
            setEntryYear(entryDate[0])
            // setEntryMonth(entryDate[1])
            setEntryMonth(entryDate[1])
        }catch(err){
            console.log(err)
        }
    }
    async function deletePlan(e){
        e.preventDefault()
        try{
            console.log("delete function")
            await axios.delete(`/api/user/delete/${user._id}`)
            await axios.delete(`/api/retire/delete/${user.retirementPlan._id}`)
            console.log(user.retirementPlan._id)
            // user.retirementPlan = []
            console.log(`deleted ${user.retirementPlan}`)
            alert("Plan Deleted")
            history.push("/")
        }catch (e){
            console.log(e)
        }
    }

    // async function deletePlan(e){
    //     e.preventDefault()
    //     try{
    //
    //     }catch(e){
    //         console.log(e)
    //     }
    // }

    console.log(retirePlan)
    return (
        <Row className="col-4 my-3">
            <h3 className="text-center resultTitle mt-2">Retirement</h3>
            <p className="disclaimer text-end mb-4">Planned on: {entryMonth}/{entryYear}</p>
            <Col className="inputDesc col-7 col-md-7 text-end mt-1">Retirement Expense:</Col>
                <input className="inputText col-5 col-md-5 mb-3 " name="" type="number" placeholder={retirePlan.retireExpense} disabled={true}/>
            <Col className="inputDesc col-7 col-md-7 text-end mt-1">Retirement Age:</Col>
                <input className="inputText col-6 col-md-5 mb-3" name="retireAge" type="number" placeholder={retirePlan.retireAge} disabled={true}/>
            <Col className="resultSubheader col-12 text-center my-3">Vanilla</Col>
            <Col className="inputDesc col-5 col-md-7 text-end mt-1">Funds at Retirement:</Col>
                <input className="inputText col-6 col-md-5 mb-3" name="lifeExp" type="number" placeholder={retirePlan.retireFunds} disabled={true}/>
            <Col className="inputDesc col-5 col-md-7 text-end mt-1 ">Savings per annum:</Col>
                <input className="inputText col-6 col-md-5 mb-3"  name="expReturns" type="number" placeholder={retirePlan.annualSavings} disabled={true}/>
            <Col className="resultSubheader col-12 text-center my-3">Inflation Adjusted</Col>
            <Col className="inputDesc col-5 col-md-7 text-end mt-1">Funds at Retirement:</Col>
                <input className="inputText col-6 col-md-5 mb-3" name="lifeExp" type="number" placeholder={retirePlan.infAdjRetireFunds} disabled={true}/>
            <Col className="inputDesc col-5 col-md-7 text-end mt-1 ">Savings per annum:</Col>
                <input className="inputText col-5 col-md-5 mb-3"  name="expReturns" type="number" placeholder={retirePlan.infAdjAnnualSavings} disabled={true}/>
            <Col className="col-5 col-md-8 "></Col>
            <button className="col-6 col-md-4 mt-2 buttonColor" onClick={deletePlan} >Delete Plan</button>
        </Row>
    );
}

export default RetirePortfolio;
