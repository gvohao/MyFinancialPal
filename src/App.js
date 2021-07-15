import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navigation from "./components/general/Navigation";
import Home from "./components/general/Home";
import RetirementPlanner from "./components/calculators/RetirementPlanner";
import AuthForm from "./components/auth/AuthForm";
import axios from "axios";
import {Container} from "react-bootstrap";
import Port from "./components/general/Port";
import Portfolio from "./components/general/Portfolio";

function App() {
    const [auth, setAuth] = useState({})
    const [user, setUser] = useState({})
    // const [admin, setAdmin] = useState({})

    // useEffect(() =>{
    //     async function setAdminStatus () {
    //         try{
    //             let axios;
    //             let {data} = await axios.get("/api/auth/user", {
    //                 headers: {
    //                     authorization: `Bearer ${localStorage.token}`
    //                 }
    //             })
    //             setAdmin(data.user.isAdmin)
    //         }catch(e){
    //             setAdmin(false)
    //         }
    //     }
    //     setAdminStatus()
    // },[]);
    useEffect(() => {
        async function setUserStatus() {
            try {
                console.log("line 37")
                let {data} = await axios.get("/api/auth/user", {
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })
                await setAuth(true)//await
                await setUser(data.user)//await
            } catch (e) {
                console.log("line 47")
                setAuth(false)
                setUser(null)
                localStorage.removeItem("token")
            }
        }
        setUserStatus()
    }, [auth])

  return (
      <BrowserRouter>
          <Container className="">
              <Navigation setAuth={setAuth} setUser={setUser} user={user}/>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>

                    <Route path='/golden' exact>
                        <RetirementPlanner user={user}/>
                    </Route>

                    <Route path='/portfolio' exact>
                        {/*<Portfolio user={user} auth={auth} />*/}
                        <Port user={user}/>
                    </Route>

                    <Route path='/auth' exact>
                        <AuthForm auth={auth} setAuth={setAuth}/>
                    </Route>
                </Switch>
          </Container>

      </BrowserRouter>
  );
}

export default App;
