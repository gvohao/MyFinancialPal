import React, {useEffect, useState} from 'react';
import axios from "axios";

function Portfolio({user, auth}) {
    const [retirePlan, setRetirePlan] = useState([])
    console.log(user?._id)
    useEffect(() =>{
        console.log("beginnning")
        async function showRetire() {
            try{
                console.log("showretire fail")
                let userId = `${user?._id}`
                // console.log(userId)
                let res = await axios.get(`/api/user/${userId}`) //hit this route from /this component page
                // let res = await axios.get(`/api/user/60e945871052ef1081201521`) //hit this route from /this component page
                console.log("showretire fail")
                console.log(res.data.user.retirementPlan)
                console.log(user._id)
                // setRetirePlan(res.data.user.retirementPlan)
                setRetirePlan([res.data.user.retirementPlan])
            }catch(e){
                console.log(e)
            }
        }
        showRetire()
        console.log("end")
    },[])

    console.log(retirePlan)
    return (
        <div>
            <h1>Portfolio</h1>
            {/*<h1 onClick={showRetire}>Portfolio</h1>*/}
            {/*<div>{retirePlan}</div>*/}

        </div>
    );
}

export default Portfolio;
