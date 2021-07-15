import React, {useState} from 'react';
import axios from "axios";

function PortEdit(props) {
    const [newRetireExpense, setNewRetireExpense] = useState(user.retirementPlan.retireExpense)
    const [newRetireAge, setNewRetireAge] = useState(user.retirementPlan.retireAge)
    const [newLifeExpectancy, setNewLifeExpectancy] = useState(user.retirementPlan.lifeExpectancy)
    const [newInvestReturn, setNewInvestReturn] = useState(user.retirementPlan.investReturn)

    function changeRetireExpense(e){
        setNewRetireExpense(e.target.value)
    }
    function changeRetireAge(e){
        setNewRetireAge(e.target.value)
    }
    function changeLifeExpectancy(e){
        setNewLifeExpectancy(e.target.value)
    }
    function changeInvestReturn(e){
        setNewInvestReturn(e.target.value)
    }
    let annualInflation = (retirePlan.annualInflation*100) //annual inflation in %
    console.log(annualInflation)
    console.log(retirePlan.investReturn)
    let discountRate = (retirePlan.investReturn - annualInflation) // discount rate in %

    let drawdownPeriod = retirePlan.lifeExpectancy - retirePlan.retireAge
    let accumulationPeriod = retirePlan.retireAge - retirePlan.currentAge

    console.log(retirePlan.retireExpense *((1-(1+(discountRate/100))**(-drawdownPeriod))/(discountRate/100)))
    let infAdjRetireFunds = retirePlan.retireExpense *((1-(1+(discountRate/100))**(-drawdownPeriod))/(discountRate/100))//PV/FV at retirement age (Ordinary Annuity)
    let presentValueRetireFunds = infAdjRetireFunds*(1/(1+(discountRate/100))**accumulationPeriod)
    let presentValueSavingsRequired = presentValueRetireFunds - retirePlan.currentFund
    let infAdjAnnualSavings = presentValueSavingsRequired/(((1-(1+(discountRate/100))**-accumulationPeriod)/(discountRate/100)))
    console.log(user.retirementPlan._id)
    async function changeGoal(e){
        e.preventDefault()
        try{
            console.log(user.retirementPlan._id)
            await axios.put(`/api/retire/edit/${user.retirementPlan._id}`,{
                retireExpense: newRetireExpense,
                retireAge: newRetireAge,
                lifeExpectancy: newLifeExpectancy,
                investReturn: newInvestReturn,
                accumulationPeriod: newRetireAge-retirePlan.currentAge,
                retireFunds: newRetireExpense*(newLifeExpectancy-newRetireAge)-retirePlan.currentFund,
                annualSavings: newRetireExpense*(newLifeExpectancy-newRetireAge)/(newRetireAge-retirePlan.currentAge),
                // retirePlan.retireExpense *((1-(1+(discountRate/100))**(-drawdownPeriod))/(discountRate/100)),
                infAdjRetireFunds: newRetireExpense*((1-(1+((newInvestReturn-annualInflation)/100))**(-(newLifeExpectancy-newRetireAge)))/((newInvestReturn-annualInflation)/100)),
                infAdjAnnualSavings: (newRetireExpense*((1-(1+((newInvestReturn-annualInflation)/100))**(-(newLifeExpectancy-newRetireAge)))/((newInvestReturn-annualInflation)/100)))*(1/(1+(discountRate/100))**(newRetireAge-retirePlan.currentAge))-retirePlan.currentAge/(((1-(1+(discountRate/100))**-accumulationPeriod)/(discountRate/100)))    //presentValueRetireFunds
                //PMT of PV=(presentValueRetireFunds - currentFund )
            })
            history.push("/")
            console.log("changed goal!")
            // console.log(res.data.retirePlan.investReturn)
        }catch(e){
            console.log(e)
        }
    }
    return (
        <div></div>
    );
}

export default PortEdit;
