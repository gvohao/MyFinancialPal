import React, {useState} from 'react';
import {Navbar, NavDropdown, Container, Col} from "react-bootstrap";
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
                <Navbar expand="lg" className="">
                    <Navbar.Brand className="mx-4" href="/">MyFinancialPal</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="">
                        {/*<div className="col-md-9">*/}
                    <NavDropdown className="=col-md-9" title="Calculators" id="responsive-nav-dropdown">
                        <NavDropdown.Item href="/golden">Retirement Planning</NavDropdown.Item>
                        <NavDropdown.Item href="/">Education Planning</NavDropdown.Item>
                        <NavDropdown.Item href="/">Legacy Planning</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/"></NavDropdown.Item>
                    </NavDropdown>
                        {/*</div>*/}
                            { user ? (
                            <div className="col-lg-10 d-flex align-items-center justify-content-end">
                                <Navbar.Text>sexy motherf#####:</Navbar.Text>
                                <NavDropdown title={user.displayName} id="basic-nav-dropdown" className='navbar-text '>
                                    <NavLink to="/portfolio" class="dropdown-item">Profile</NavLink>
                                    {/*<NavDropdown.Item onClick={linkToPortfolio}>Profile</NavDropdown.Item>*/}
                                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                                    {/*<div className="px-2 avatar "> {user.displayName.slice(0,1).toUpperCase()} </div>*/}
                            </div>
                        ) : (
                            <NavLink to="/auth" className='navbar-text col-10 d-flex justify-content-end'>Register / Login</NavLink>
                        )}
                    </Navbar.Collapse>
                </Navbar>
        </Container>
    );
}

export default Navigation;
