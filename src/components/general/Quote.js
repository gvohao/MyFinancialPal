import React, {useEffect, useState} from 'react';

function Quote(props) {
    let quotes = ['“Compound interest is the eighth wonder of the world. He who understands it, earns it ... he who doesnt ... pays it.” ― Albert Einstein',
        '“The intelligent investor is a realist who sells to optimists and buys from pessimists.”\n' +
        '― Benjamin Graham, The Intelligent Investor',
        "Have a good day ― guohao",
        '“In the short run, the market is a voting machine but in the long run, it is a weighing machine.”\n' +
        '― Benjamin Graham',
        '“But investing isn’t about beating others at their game. It’s about controlling yourself at your own game.”\n' +
        '― Benjamin Graham, The Intelligent Investor',
        '"Smack that oh-oh!" ―Akon'

    ]

    const [sexyQuote, setSexyQuote] = useState("")
    function getSexy(){
        setSexyQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }

    useEffect(() => {
        getSexy()
    },[])
    return (
        <div className="overlay" onClick={getSexy}>{sexyQuote}</div>
    );
}

export default Quote;
