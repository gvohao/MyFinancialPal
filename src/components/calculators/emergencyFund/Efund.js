import React, {useState} from 'react';
import {Col, Row} from "react-bootstrap";
import EfundBudget from "./EfundBudget";
import EfundAmount from "./EfundAmount";

function Efund({user}) {

    const[budget, setBudget] = useState(false)
    function handleBudget(){
        setBudget(true)
    }
    const[amount, setAmount] = useState(false)
    function handleAmount(){
        setAmount(true)
    }
    return (
        <Row className="d-flex justify-content-around">
        <Col className="col-12 mt-3 text-center eFundtitleStyle "> Emergency Fund Calculator </Col>
            {/*<Col className="col-2 bg-danger"></Col>*/}
            <Col className="col-10 px-5 mb-4 " id="efundIntro" >
                <Col className="col-12 mb-2 efundSubheader" >Emergency Fund? </Col>
                <Col className="col-12 px-2" >The concept of "saving for rainy days",
                    a cushion against unexpected financial setbacks such as,
                    but not limited to: <u>losing a job</u>, <u>unforeseen medical expenses</u> or <u>unexpected vehicle repairs required</u>.
                </Col>
                <Col className="col-12 mt-3 px-2" >Ideally, emergency funds range from <u>3 months of expenses</u> up to <u>6 months of monthly income</u> depending of conservativeness of the individual.
                How conservative one might want to be can be dependent on factors such as their <u>ability to secure another role</u> in event of job loss and <u>level of financial commitment or dependants</u> they have.</Col>
                {/*<Col className="col-2 px-4 mt-3 fw-bold" >Commentary:</Col>*/}
                <Col className="col-12 mt-3 px-5 efundComment" >If you can stomach more risk and have little to no financial commitment or dependants (commonly new jobbers), you should consider keeping as little as 3 months of expenses in emergency cash for efficient portfolio allocation and maximise growth of personal portfolio.</Col>
                </Col>

            <Row className="col-12 text-center mb-5 ">
                <Col className="col-6 inputText ">
                    <Col className="p-3">To calculate your monthly budget based on your existing fund:</Col>
                    <button className="col-6 w-50 calcButton" onClick={handleBudget}>Find Monthly Budget</button>
                </Col>
                <Col className="col-6 inputText">
                    <Col className="p-3 ">To calculate the amount of emergency fund that is suitable for you:</Col>
                    <button className="col-6 w-50 calcButton" onClick={handleAmount}>Calculate Emergency Fund</button>
                </Col>

            </Row>
            <Col className="col-12 "></Col>
            {budget ?
                <EfundBudget user={user}/>
                :
                <></>
            }
            {amount ?
                <EfundAmount user={user}/>
                :
                <></>
            }
        </Row>

        );
}

export default Efund;
