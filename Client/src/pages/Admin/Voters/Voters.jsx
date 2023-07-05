import React, {useEffect, useState} from 'react';
import {getAllVoters, verifyVoter} from "../../../services/AdminService";
import ProgressComponent from "../../../components/ProgressComponent";

const Voters = () => {
    let _prg = {
        prgMsg: "Loading..", warn: false, success: false
    }
    const [voters, setVoters] = useState([]);
    const [prgMsg, setPrgMsg] = useState('Loading...');
    const [progress, setProgress] = useState(_prg);
    const [showProgress, setShowProgress] = useState(false);

    function getAllUsers() {

        getAllVoters().then(r => {
            setVoters(r)
            console.log(r)
            if (r.length === 0) setPrgMsg('No Voters present in the network !!!')
        })
    }

    useEffect(() => {
        return () => {
            getAllUsers()
        };
    }, []);

    const handleVoterVerify = (v) => {
        setShowProgress(true)
        console.log(v)
        verifyVoter(v.key).then(r => {
            setProgress({...progress, success: true, prgMsg: 'Voter Verified'})
            let i = setInterval(() => {
                handleCloseProgress()
                clearInterval(i)
            }, 3000)
            getAllUsers()
        }).catch(err => {
            setProgress({...progress, warn: true, prgMsg: 'Voter Verification failed'})
        })
    }

    function handleCloseProgress() {
        setProgress(_prg)
        setShowProgress(false)
    }

    return (<div className="container-fluid">
        {showProgress ? <ProgressComponent success={progress.success} warn={progress.warn} msg={progress.prgMsg}
                                           onClose={() => handleCloseProgress()}/> : null}

        <div className="container">

            {voters.length >= 1 ? <table className="table table-hover">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">UserId</th>
                    <th scope="col">National Id</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {voters.map((v, i) => <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td className="election-data">{v.key}</td>
                    <td className="election-data">{v.nationalId}</td>
                    <td>
                        {v.isActive ? <button className="btn btn-sm btn-dark" disabled> Verified
                        </button> : <button className="btn btn-sm btn-success" onClick={() => handleVoterVerify(v)}><i
                            className="fa-solid fa-user-check"></i>&nbsp; Verify
                        </button>}
                    </td>
                </tr>)}

                </tbody>
            </table> : <span>{prgMsg}</span>}

        </div>

    </div>);
};

export default Voters;