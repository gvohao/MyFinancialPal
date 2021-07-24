import React, {useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";

function EfundAmount({user}) {
    const [show, setShow] = useState(false)
    const initialState = { mthVarExp:0, mthFixExp:0, mthSalary:0, secIncome:0, otherIncome:0 }
    const[efundAmtForm, setEfundAmtForm] = useState(initialState)

    const handleChange = (e) => {
        setEfundAmtForm({...efundAmtForm, [e.target.name] : e.target.value})
    }
    function showResult(){
        setShow(true)
    }
    const[sixMthSal, setSixMthSal] = useState(0)
    const[sixMthExp, setSixMthExp] = useState(0)
    const[threeMthSal, setThreeMthSal] = useState(0)
    const[threeMthExp, setThreeMthExp] = useState(0)
    function calcAmount(){
        setSixMthSal(efundAmtForm.mthSalary*6)
        setThreeMthSal(efundAmtForm.mthSalary*3)
        setSixMthExp((efundAmtForm.mthVarExp+efundAmtForm.mthFixExp)*6)
        setThreeMthExp((efundAmtForm.mthVarExp+efundAmtForm.mthFixExp)*3)
    }
    return (
        <Row className="vh-100">
            <Col className="col-6">
                <Row>
                    <Col className="col-12 text-center efundSubheader mb-2 border-top">Emergency Fund Amount</Col>
                    <Col className="inputDesc col-md-4 text-end mt-1">Monthly Variable Expenses:</Col>
                    <input className="inputText col-6 col-md-6 mb-3 "  name="mthVarExp" type="number" placeholder="Eg. Dining, shopping, leisure..." min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Monthly Fixed Expenses:</Col>
                    <input className="inputText col-6 col-md-6 mb-3 "  name="mthFixExp" type="number" placeholder="Eg. Mortgage installments, insurance premiums, utility bills..." min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Monthly Salary:</Col>
                    <input className="inputText col-6 col-md-6 mb-3 "  name="mthSalary" type="number" placeholder="Enter monthly primary salary..." min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Secondary Income (Monthly):</Col>
                    <input className="inputText col-6 col-md-6 mb-3" name="secIncome" type="number" placeholder="Enter income from side hustles..." min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Other Income (Monthly):</Col>
                    <input className="inputText col-6 col-md-6 mb-3" name="otherIncome" type="number" placeholder="Eg. rental income, dividends (passive income)... " min="0" onChange={handleChange} />
                    <Col md={4}></Col>
                    <Button className="col-6 col-md-6 buttonColor" onClick={showResult} onClickCapture={calcAmount}>Get Results</Button>
                </Row>
            </Col>
            <Col className="">
                <Col className="col-12 mb-3 mt-5">entering all those was simply for a clearer thought process and to remind users of some of the expenses they might not</Col>
                <Row>
                <Col sm={3}>Three Month Exp: {threeMthExp}</Col>
                <Col sm={3}>Three Month Salary: {threeMthSal}</Col>
                <Col sm={3}>Six Month Exp: {sixMthExp}</Col>
                <Col sm={3}>Six Month Salary: {sixMthSal}</Col>
                </Row>
            </Col>



        </Row>
    );
}

export default EfundAmount;
