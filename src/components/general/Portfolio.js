import React, {useEffect, useState} from 'react';
import axios from "axios";

function Portfolio(props) {
    const [retirePlan, setRetirePlan] = useState([])

    useEffect(() =>{
        console.log("beginnning")
        async function showRetire() {
            try{
                console.log("showretire fail")
                let res = await axios.get("/api/retire")//hit this route from /this component page
                console.log(res.data)
                setRetirePlan(res.data.retirePlan[0].currentAge)
                // console.log(retirePlan)
            }catch(e){
                console.log(e)
            }

        }
        showRetire()
        console.log("end")
    },[])

    return (
        <div>
            <h1>Portfolio</h1>
            <div>{retirePlan}</div>

        </div>
    );
}

export default Portfolio;
