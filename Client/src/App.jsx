import './App.css'
import {RouterProvider} from "react-router-dom";
import {RouterList} from "./routes/router.jsx";
import {useEffect, useState} from "react";
import Web3Service from "./services/Web3Service";

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [prgMsg, setPrgMsg] = useState('Connecting to Metamask...');
    useEffect(() => {
        return () => {
            let ws = new Web3Service();
            ws.getWeb3().then(w => {
                // console.log(w)
                if (w === undefined) setPrgMsg('Install Metamask extension...')
            }).catch(err => {
                console.log(err)
            })
            ws.getContract().then(c => {
                // console.log(c)
                if (c != null) {
                    setIsConnected(true);
                }
            }).catch(err => {
                console.log(err)
            })
        };
    }, []);

    return (<div className="App">
        {isConnected ?
            <RouterProvider router={RouterList}/> :
            <div>{prgMsg}</div>}

    </div>)
}

export default App
