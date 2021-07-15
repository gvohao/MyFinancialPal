import React, {useEffect, useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import boxing from "../img/boxing.jpg"
import {CanvasJSChart} from "canvasjs-react-charts";
import Inflation from "./Inflation";
import Quote from "./Quote";
import MoneySupply from "./MoneySupply";

function Home() {
    return (
        <Container className="homepage min-vh-100 ">
            {/*<img className="img" src={boxing} alt="boxing"/>*/}
            <Row className="">
                <Col id="title" className="col-lg-12 text-center">
                    Planning made easy
                </Col>
                <Col className="col-lg-8 mt-3">
                    <Inflation />
                    <Quote/>
                </Col>
                <Col className="col-lg-4 mt-3">
                    <MoneySupply/>
                </Col>
            </Row>

        </Container>
    );
}

export default Home;
