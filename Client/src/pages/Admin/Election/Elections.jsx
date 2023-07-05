import React, {useEffect, useState} from 'react';
import AddElection from "../../../components/AddElection.jsx";
import './elections.css'
import {
    addElection,
    deleteElection,
    formatDate,
    getAllCandidatesServer,
    getAllConstituencies,
    getAllElections,
    getElectionReportDetails,
    updateElection
} from "../../../services/AdminService";
import CandidateCard from "../../../components/CandidateCard";
import ProgressComponent from "../../../components/ProgressComponent";
import jsPDF from "jspdf";
import ElectionReport from "../../../components/ElectionReport";
import ReactDOMServer from "react-dom/server";

const Elections = (src, options) => {
    let Election = {
        startDate: "", endDate: "", constituencyId: ""
    }
    let Progress = {
        success: false, warn: false, msg: 'Loading...'
    }
    const [election, setElection] = useState(Election);
    const [elections, setElections] = useState([]);
    const [constituencies, setConstituencies] = useState([]);
    const [allCandidates, setAllCandidates] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [eModal, setEModal] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(Progress);


    const getElections = () => {
        getAllElections().then(r => {
            // console.log(r)
            setElections(r.data)
        })
    }

    useEffect(() => {
        return () => {
            getElections()
            getAllConstituencies().then(r => {
                setConstituencies(r.data)
                setEModal(new bootstrap.Modal('#e-modal'))
            })
            getCandidates()
        };
    }, []);


    const handleAddElection = () => {
        eModal.hide()
        setShowProgress(true)
        if (election.endDate !== '' && election.startDate !== '' && election.constituencyId !== '') {
            setProgress({...progress, msg: 'Adding Election...'})
            addElection(election)
                .then(r => {
                    if (r) {
                        setProgress({...progress, success: true, msg: 'Election added'})
                        getElections()
                        closeProgress()
                    }
                    else {
                        setProgress({...progress, warn: true, msg: 'Failed Adding Election'})
                    }
                })
        }
        else {
            setProgress({...progress, warn: true, msg: 'Please fill all details !!!'})
        }
    }

    function closeProgress() {
        setProgress(Progress)
        setShowProgress(false)
    }

    const getCandidates = () => {
        getAllCandidatesServer().then(r => {
            setAllCandidates(r.data)
        })
    }


    const handleViewCandidates = (eId) => {
        const candidateModal = new bootstrap.Modal('#c-modal')
        console.log(allCandidates)
        setCandidates(allCandidates.filter((c, i) => c.electionId === eId))
        candidateModal.show()
        console.log(allCandidates.filter((c, i) => {
            console.log(c, eId)
            return c.electionId === eId
        }))
    }

    const onUpdateElection = (e) => {
        console.log(e)
        updateElection(e).then(r => {
            console.log(r)
            getElections()
        })
    }

    const handleDeleteElection = (id) => {
        deleteElection(id).then(r => {
            console.log(r)
            if (r.data.status === "success") {
                getElections()
            }
        })
    };

    const handleGenerateElectionReport = (eId) => {

        getElectionReportDetails(eId).then((r) => {
            console.log(Object.keys(r.e))
            let candidates = allCandidates.filter((c, i) => c.electionId === eId)
            const doc = new jsPDF({
                orientation: "portrait", unit: "pt", format: "a4", hotfixes: ["px_scaling"], compress: true,
            });
            let docWidth = doc.internal.pageSize.getWidth();
            let election = r.election
            election = {...election, candidates: candidates}
            election = {...election, votes: r.e['2']}
            console.log(r.e)
            election.voters = r.e['1']
            console.log(election)
            doc.html(ReactDOMServer.renderToString(<ElectionReport election={election}/>), {
                autoPaging: "slice", pagesplit: true, callback(doc) {
                    let pageCount = doc.internal.getNumberOfPages();
                    console.log(pageCount)
                    for (let i = 2; i <= pageCount; i++) {
                        doc.deletePage(i)
                    }
                    doc.save(`${eId}_report.pdf`)
                    // doc.output("dataurlnewwindow");
                    // window.open(doc.output('bloburl'));
                }, width:   docWidth - 50, windowWidth: 1200, x: 20, y: 20,
            });

        })
    }

    function getConstituencyName(id) {
        return constituencies.filter((c, i) => c.id === id)[0]?.name
    }

    const handleOnAddElection = () => {
        if (constituencies.length >= 1) {
            eModal.show()
        }
        else {
            setShowProgress(true)
            setProgress({...progress, msg: 'No Constituencies', warn: true})
        }
    };
    return (<div className="container-fluid">
        <div className="container-fluid" id="pdf">

        </div>
        {showProgress ?
            <ProgressComponent success={progress.success} warn={progress.warn} msg={progress.msg}
                               onClose={() => closeProgress()}/> :
            null}

        <button type="button" className="btn btn-outline-primary m-2" onClick={() => handleOnAddElection()}>
            <i className="fa-solid fa-square-poll-vertical"></i>&nbsp;  Add Election
        </button>
        <div className="container">
            <table className="table table-hover">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Election</th>
                    <th scope="col">Candidate</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Actions</th>
                    <th scope="col">Report</th>
                </tr>
                </thead>
                <tbody className="table-group-divider">
                {elections.map((election, index) => <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td className="election-data">{election.electionId}
                        <br/>{getConstituencyName(election.constituencyId)}</td>
                    <td className="election-data">
                        <button className="btn bn-sm btn-dark btn-w-80"
                                onClick={() => handleViewCandidates(election.electionId)}>
                            <i className="fa-solid fa-eye"></i> VIEW
                        </button>
                    </td>
                    <td className="election-data">{formatDate(election.startDate)}</td>
                    <td className="election-data">{formatDate(election.endDate)}</td>
                    <td className="election-data">
                        <div className="d-flex">
                            {/*<button className="btn btn-sm btn-danger mx-1">STOP</button>*/}
                            {election.status ?
                                <button className="btn btn-sm btn-danger mx-1 btn-w-80"
                                        onClick={() => onUpdateElection({...election, status: false})}>
                                    <i className="fa-solid fa-stop"></i>&nbsp; STOP</button> :
                                <button className="btn btn-sm btn-success mx-1 btn-w-80"
                                        onClick={() => onUpdateElection({...election, status: true})}>
                                    <i className="fa-solid fa-play"></i>&nbsp; START
                                </button>}

                            {election.result ?
                                <button className="btn btn-sm btn-info mx-1 "
                                        onClick={() => onUpdateElection({
                                            ...election, result: false
                                        })}>
                                    <i className="fa-solid fa-download"></i>&nbsp; UN PUBLISH
                                </button> :
                                null}
                            {!election.result ?
                                <button className="btn btn-sm btn-warning mx-1 btn-w-80"
                                        onClick={() => onUpdateElection({
                                            ...election, result: true
                                        })}>
                                    <i className="fa-solid fa-upload"></i>&nbsp; PUBLISH
                                </button> :
                                null}

                            <button className="btn btn-sm btn-danger mx-1 px-2"
                                    onClick={() => handleDeleteElection(election.id)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                    <td>
                        <button className="btn btn-sm btn-outline-primary"
                                onClick={() => handleGenerateElectionReport(election.electionId)}
                            // target="_blank"
                            // to={`/report/${election.electionId}`}
                        >
                            <i className="fa-solid fa-file-pdf"></i> Generate
                        </button>
                    </td>
                </tr>)}

                </tbody>
            </table>
        </div>
        {/* Add Election Modal */}
        <div className="modal fade" id="e-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Election</h1>
                        <button type="button" className="btn-close" onClick={() => eModal.hide()}></button>
                    </div>
                    <div className="modal-body">
                        <AddElection constituencies={constituencies} election={election} setElection={setElection}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                onClick={() => eModal.hide()}>Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => handleAddElection()}>Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/*    Candidates Modal */}
        <div className="modal fade" id="c-modal" data-bs-backdrop="static" data-bs-keyboard="false"
             tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Candidates</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {candidates.length >= 1 ?
                            <div> {candidates.map((c, i) => <CandidateCard candidate={c} key={i}/>)} </div> :
                            <>No
                                Candidates...</>}

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

    </div>);
};

export default Elections;