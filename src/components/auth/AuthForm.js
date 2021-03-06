import React, { useState } from 'react';
import {Form, Row, Col, Button} from "react-bootstrap";
import axios from "axios";
import { useHistory } from 'react-router-dom'

function Register({auth, setAuth, user}) {
    //toggle between registration and login
    const [isSignup, setIsSignup] = useState(true);
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
    }
    //handles input fields
    const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''} //for sign up field
    const [formData, setFormData] = useState(initialState)
    const history = useHistory()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const registerSubmit = async(e) => {
        e.preventDefault(); //prevent refresh on form submit
        try {
            console.log("something")
            let res = await axios.post("/api/auth/register", formData)
            console.log(res)
            console.log(res.data.token)
            localStorage.setItem("token", res.data.token)
            setAuth(true)
            history.push('/')
        } catch (error) {
            console.log(`HEREEREREER ${error}`)
            alert(error)
        }
    }

    const loginSubmit = async(e) => {
        e.preventDefault(); //prevent refresh on form submit

        try {
            console.log("here")
            let res = await axios.post("/api/auth/login", formData)
            console.log("abc")
            console.log(res.data.token)
            localStorage.setItem("token", res.data.token)
            setAuth(true)
            history.push('/')
        }catch(error){
            console.log(error)
            alert(error)
        }
    }


    return (
        <Row className="justify-content-center champange">
            <Col className="col-12 text-center roboto"><h3>{isSignup ? "Register" : "Log In"}</h3></Col>
            <Col className="d-flex justify-content-center col-md-12l-12 roboto">
                <Row>
                    <Col className="col-12 signupForm">
                        <Form onSubmit={isSignup ? registerSubmit : loginSubmit}>
                            { isSignup && (
                                <Row className="align-items-center mt-3">
                                    <Col className="col-12 col-md-6 text-right">
                                        <label>Display Name</label></Col>
                                    <Col className="col-12 col-md-6">
                                        {/*<FormControl className="col-6 mx-auto" type="text" placeholder="First Name" name="firstName" onChange={handleChange} ></FormControl>*/}
                                        {/*<FormControl className="col-6 mx-auto" type="text" placeholder="Last Name" name="lastName" onChange={handleChange} ></FormControl>*/}
                                        <input type="text" placeholder="Display Name" name="displayName" onChange={handleChange} required />
                                    </Col>
                                </Row>
                            )}
                            {/*<FormControl type="email" placeholder="Display Name" name="displayName" onChange={handleChange} />*/}
                            <Row className="align-items-center mt-1">
                                <Col className="col-12 col-md-6 text-right">
                                    <label>Email</label></Col>
                                <Col className="col-12 col-md-6">
                                    <input type="email" placeholder="Email Address" name="email" onChange={handleChange} required />
                                </Col>
                            </Row>
                            <Row className="align-items-center mt-1">
                                <Col className="col-12 col-md-6 text-right">
                                    <label>Password</label></Col>
                                <Col className="col-12 col-md-6">
                                    <input placeholder="Password" name="password" onChange={handleChange} type='password' required  />
                                </Col>
                            </Row>
                            {isSignup &&
                            <Row className="align-items-center mt-1 mb-3">
                                <Col className="col-12 col-md-6 text-right">
                                    <label>Confirm Password</label></Col>
                                <Col className="col-12 col-md-6">
                                    <input className='confirmPassword' placeholder='Confirm Password' name="confirmPassword" onChange={handleChange} type="password" required />
                                </Col>
                            </Row>
                            }
                            <Row className="mt-2 mb-4 text-center">
                                <Col className="col-12">
                                    <Button type='submit' variant="primary" >
                                        {isSignup ? "Sign Up" : "Sign In"}
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="text-center">
                                <Col className="col-12 ">
                                    <a onClick={switchMode} >
                                        {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                                    </a>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>

    );
}

export default Register;
