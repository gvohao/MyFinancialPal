import React, {useEffect, useState} from "react";
import {Col, Row, Button} from "react-bootstrap";
import {logDOM} from "@testing-library/react";
import {isNumber} from "chart.js/helpers";

function Efund({user}) {
    const [show, setShow] = useState(false)
    const[inputList, setInputList] = useState([{ "ccBill": 0 }])
    const initialState = { curEfund: 0, liqAsset:0, curDebt:0, fixExpense:0, mthIncome:0, stopIncome:0 }
    const[efundForm, setEfundForm] = useState(initialState)

    function handleChange(e){
        setEfundForm({...efundForm, [e.target.name] : e.target.value})
    }

    //handle CC
    const handleCardsChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
        // setInputList({...inputList, [e.target.name] : e.target.value})
    }
    function handleAdd() {
        setInputList([...inputList, {ccBill: 0}])
    }
    function handleRemove(index) {
        const list = [...inputList]
        list.splice(index, 1)
        setInputList(list)
    }
    function showResult(){
        setShow(true)
    }

    useEffect(()=>{
        calcEfund()
    },[efundForm])

    let ccBill = []
    const [creditBill, setCreditBill] = useState(0)
    const [liqFund, setLiqFund] = useState(0)
    const [shortTermDebt, setShortTermDebt] = useState(0)
    const [burnRate, setBurnRate] = useState(0) //monthly cashflow
    const [cashBudget, setCashBudget] = useState(0)
    const [budget, setBudget] = useState(0)

    function calcEfund(){
        for(let i =0; i<inputList.length; i++){
            if(inputList[i]){
                ccBill.push(Number(inputList[i].ccBill))
            }
            setCreditBill(ccBill.reduce((a, b) => a + b))
        }
        setLiqFund(Number(efundForm.curEfund) + Number(efundForm.liqAsset))
        setShortTermDebt(Number(efundForm.curDebt) + creditBill)
        setBurnRate(Number(efundForm.mthIncome) - Number(efundForm.fixExpense))
        setCashBudget((Number(efundForm.curEfund) - Number(shortTermDebt))/ efundForm.stopIncome + burnRate)
        setBudget((liqFund - shortTermDebt)/ efundForm.stopIncome + burnRate)
    }

    return (
        <Row className="vh-100">
            <Col className="col-12 mt-3 text-center eFundtitleStyle "> Emergency Fund Calculator </Col>

            <Col>
                <Row>
                    <Col className="inputDesc col-md-4 text-end mt-1">Current Emergency Fund:</Col>
                        <input className="inputText col-6 col-md-6 mb-3 "  name="curEfund" type="number" placeholder="Enter current cash holdings" min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Liquid Assets:</Col>
                        <input className="inputText col-6 col-md-6 mb-3 "  name="liqAsset" type="number" placeholder="Eg. Fixed deposit, shares, gold..." min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Current Debt:</Col>
                        <input className="inputText col-6 col-md-6 mb-3 "  name="curDebt" type="number" placeholder="Enter short term debt (one off payment)" min="0" onChange={handleChange} />
                    {inputList.map((ele, idx) => {
                        return(
                            <>
                    <Col className="inputDesc col-md-4 text-end mt-1">Outstanding Credit Card Bills:</Col>
                        <input className="inputText col-6 col-md-3 mb-3 "  name="ccBill" value={ele.ccBill} type="number" placeholder="Enter outstanding credit card bills" min="0" onChange={e => handleCardsChange(e, idx)}/>
                            {inputList.length-1 === idx &&
                            <button className="col-md-1" id="addButton" onClick={handleAdd}>Add</button>}
                            {inputList.length !==1 &&
                            <button className="col-md-2" id="removeButton" onClick={() => handleRemove(idx)}>Remove</button>}
                            </>
                    )
                    })}
                    <Col className="inputDesc col-md-4 text-end mt-1">Fixed Expenses:</Col>
                        <input className="inputText col-6 col-md-6 mb-3" name="fixExpense" type="number" placeholder="Eg. Mortgage installments, insurance premiums, utility bills..." min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Supplementary income:</Col>
                        <input className="inputText col-6 col-md-6 mb-3" name="mthIncome" type="number" placeholder="Supplementary income during current period" min="0" onChange={handleChange} />
                    <Col className="inputDesc col-md-4 text-end mt-1">Expected stoppage of income:</Col>
                        <input className="inputText col-6 col-md-6 mb-3" name="stopIncome" type="number" placeholder="Enter number of months" min="0" onChange={handleChange} />
                    <Col md={4}></Col>
                    <Button className="col-6 col-md-6 buttonColor " onClick={showResult} onClickCapture={calcEfund}>Get Results</Button>
                </Row>
            </Col>
            {show ?
                <Col className="col-md-4 d-flex align-items-center">
                    <Row className="d-flex justify-content-center">
                        <Col className="resultHeader text-center mb-4 col-md-12">Your Emergency Fund</Col>
                        <Col className="efundResultHead mb-3 col-md-12">Without liquidating any assets, </Col>
                        <Col className="resultSubheader text-center col-md-12">you have a budget of <b>${cashBudget.toFixed(2)}/month</b> over the period of <b>{efundForm.stopIncome}</b> months.</Col>
                        <Col className="efundResultHead mb-3 col-md-12  mt-5">With full liquidity, </Col>
                        <Col className="resultSubheader text-center col-md-12">you have access to a budget of <b>${budget.toFixed(2)}/month</b> over the period of {efundForm.stopIncome} months.</Col>
                            {user ?
                                <Button className="mt-3 w-50 mb-5 buttonColor mt-3"  >Save Emergency Fund</Button>
                                :
                                <></>
                            }
                    </Row>
                </Col>
                :
                <></>
            }
            <Col className="col-12" id="efundIntro" >
                <Col className="col-12" >Emergency fund is the concept of  "saving for rainy days".</Col>
                <Col className="col-12" >Ideal range of cash savings should be up to 6 months of one's monthly income to take a conservative approach.</Col>
                <Col className="col-12" >One should consider keeping as little as 3 months of expenses in emergency cash for efficient portfolio allocation and maximise growth of personal portfolio.</Col>
            </Col>
        </Row>
    );
}

export default Efund;
// {inputList.map((ele, idx) => {
//     return(
//         <Row className="my-2 col-md-7" >
//             <input className="col-md-5" name="ccBill" value={ele.ccBill.toFixed(2)} type="number" onChange={e => handleChange(e, idx)}/>
//             {inputList.length-1 === idx &&
//             <button className="col-md-2" id="addButton" onClick={handleAdd}>Add</button>}
//             {inputList.length !==1 &&
//             <button className="col-md-3" id="removeButton"  onClick={() => handleRemove(idx)}>Remove</button>}
//         </Row>
//
//
//     )
// })}
