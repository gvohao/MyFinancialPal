import React, {useState} from 'react';
import {Nav, Navbar, Form, FormControl, NavDropdown, Button, CardImg, Row, Container, Col} from "react-bootstrap";
import {NavLink, useHistory} from "react-router-dom";

function Navigation({id, setAuth, user, setUser}){
    const [search, setSearch] = useState('');
    let history = useHistory()

    const clickHandler = (e) => {
        history.push(`/chart/${search}`)
    }

    const textHandler = (e) => {
        setSearch(e.target.value)
    }

    const keyPressHandler = (e) => {
        if (e.key === 'Enter') {
            history.push(`/chart/${search}`)
        }
    }
    // console.log(search)

    function handleSubmit(e) {
        if (e.target.value !== {id})
            e.preventDefault();
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.clear()
        setAuth(false)
        history.push('/') //redirect user to homepage once logout
        setUser(null) //set user to null) once logout
    }

    return (
        <Container className="">
                <Navbar bg="light" expand="lg">
                    <Col className="col-2 ">
                    <Navbar.Brand href="/">INSERT LOGO HERE</Navbar.Brand>
                    </Col>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="">
                    <Col className="col-9 ">
                    <NavDropdown title="Calculators" id="responsive-nav-dropdown">
                        <NavDropdown.Item href="/golden">Retirement Planning</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Education Planning</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Legacy Planning</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4"></NavDropdown.Item>
                    </NavDropdown>
                    </Col>
                        { user ? (
                            <>
                                <Navbar.Text>sexy motherfucker:</Navbar.Text>
                                <NavDropdown title={user.displayName} id="basic-nav-dropdown" className='navbar-text '>
                                    <NavDropdown.Item href={`/profile/${user._id}`}>Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                                <div className="spriteDetailsCtn d-flex">
                                    <div className="spriteCtn">
                                        {/*<CardImg src={user.displayImage?.itemImage} />*/}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <NavLink to={"/auth"} className='navbar-text'>Register / Login</NavLink>
                        )}
                    </Navbar.Collapse>
                </Navbar>
        </Container>
    );
}

export default Navigation;
