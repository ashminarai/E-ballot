import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {formatDate, getElectionResults} from "../../services/AdminService";
import CandidateCard from "../../components/CandidateCard";
import './result-page-component.css'
import trophy from '../../assets/images/trophy.png'
import {getElectionDetails} from "../../services/VoterService";

const ResultPageComponent = () => {
    let Election = {
        id:             0,
        electionId:     '',
        startDate:      '',
        endDate:        '',
        status:         false,
        result:         true,
        createdAt:      '',
        updatedAt:      '',
        constituencyId: 0,
        constituency:   {
            id: 0, name: '', createdAt: '', updatedAt: ''
        }
    }
    let {id} = useParams()
    const [candidates, setCandidates] = useState([]);
    const [election, setElection] = useState(Election);
    const [noWinner, setNoWinner] = useState(false);
    const [prg, setPrg] = useState('Loading...');

    useEffect(() => {
        return () => {
            getElectionDetails(id).then(e => {
                setElection(e.data)
                let _e = e.data
                getElectionResults(id).then(r => {
                    if (r.length >= 1) {
                        r.sort((a, b) => {
                            return b.votes - a?.votes
                        })
                        if (r[0]?.votes === r[1]?.votes) {
                            setNoWinner(true)
                        }
                        setCandidates(r)

                        _e = {..._e, votes: 0}
                        r.forEach((c, i) => {
                            _e.votes = _e.votes + parseInt(c.votes)
                            console.log(_e)
                            if (i === r.length - 1) setElection(_e)
                        })
                    }
                    else {
                        setPrg('No Candidates in the Election...')
                    }
                })
            }).catch(err => {
                setPrg('Invalid Election...')
            })

        };
    }, []);

    return (<div className="container-fluid result-page-comp bg-body-tertiary">
        <div className="container d-flex align-items-center justify-content-center flex-column mb-3">
            {candidates.length >= 1 ?
                <>
                    {election ?
                        <div className="details w-75">
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item bg-transparent">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button collapsed bg-transparent" type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-controls="collapseOne">
                                            <div className="fs-3 fw-bold">ELECTION</div>
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse"
                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                   <pre>
                                       Election Id   : {election.electionId}
                                       <br/>
                                       Constituency  : {election.constituency?.name}
                                       <br/>
                                       Start Date    : {formatDate(election.startDate)}
                                       <br/>
                                       End Date      : {formatDate(election.endDate)}
                                       <br/>
                                       Total Votes   : {election.votes}
                    </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        null}

                    <div className="main-card bg-body-emphasis mb-5">
                        <div className="row">
                            {!noWinner ?
                                <>
                                    <div className="col-12">
                                        <div
                                            className="winner p-3 rounded-4 shadow-lg border border-2 border-success m-2">
                                            <img className="trophy-icon m-2" src={trophy} alt="" width="80"
                                                 height="80"/>
                                            <div className="p-2">
                                                <CandidateCard result={true} candidate={candidates[0]}/>
                                            </div>

                                        </div>
                                    </div>
                                    {candidates.slice(1).map((c, i) => <div key={i}>
                                        <div className="col">
                                            <div className="candidates">
                                                <CandidateCard result={true} candidate={c}/>
                                            </div>
                                        </div>
                                    </div>)}
                                </> :
                                <> <span className="w-100 text-center text-danger fw-bold fst-italic fs-4 p-2">No Winners</span>
                                    {candidates.map((c, i) => <div key={i}>
                                        <div className="col">
                                            <div className="candidates">
                                                <CandidateCard result={true} candidate={c}/>
                                            </div>
                                        </div>
                                    </div>)}
                                </>}


                        </div>

                    </div>
                </> :
                <div className="container-fluid min-vh-100">{prg}</div>}
        </div>


    </div>);
};

export default ResultPageComponent;
