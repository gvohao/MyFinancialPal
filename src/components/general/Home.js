import React, {useEffect, useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import boxing from "../img/boxing.jpg"
import {CanvasJSChart} from "canvasjs-react-charts";
import Inflation from "./Inflation";
import Quote from "./Quote";
import MoneySupply from "./MoneySupply";
import MoneySupplySt from "./MoneySupplyST";


function Home() {

    let quotes = ['“Compound interest is the eighth wonder of the world. He who understands it, earns it ... he who doesnt ... pays it.” ― Albert Einstein',
        '“The intelligent investor is a realist who sells to optimists and buys from pessimists.”\n' +
        '― Benjamin Graham, The Intelligent Investor',
        "<3 sei29 ― guohao",
        '“In the short run, the market is a voting machine but in the long run, it is a weighing machine.”\n' +
        '― Benjamin Graham',
        '“But investing isn’t about beating others at their game. It’s about controlling yourself at your own game.”\n' +
        '― Benjamin Graham, The Intelligent Investor',
        '"Money no problem, pocket full of that now." ― Akon'

    ]

    const [sexyQuote, setSexyQuote] = useState("")
    function getSexy(){
        setSexyQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }

    useEffect(() => {
        getSexy()
    },[])

    return (
        <Container className="homepage min-vh-100 ">
            {/*<img className="img" src={boxing} alt="boxing"/>*/}
            <Row className="">
                <Col className="col-lg-12 text-center lavender banner">
                    <h3 id="title">
                        MyFinancialPal
                    </h3>
                    <h5 id="subtitle">
                        Money management made manageable.
                    </h5>
                    <h5 id="homequote" className="col-lg-12 mt-5 d-flex justify-content-center" onClick={getSexy}>
                        {sexyQuote}
                    </h5>
                </Col>
                <Col className="col-lg-8 mt-3 ">
                    <Inflation />
                </Col>
                <Col className="col-lg-4 mt-3">
                    <MoneySupply/>

                    <MoneySupplySt/>
                </Col>
                <Col className="col-lg-12 vh-100 homepageTwo">
                    <Quote/>

                </Col>
            </Row>

        </Container>
    );
}

export default Home;
