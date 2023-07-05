import React, {useEffect, useState} from 'react';
import user_icon from '../../../assets/images/user.png'
import picture from '../../../assets/images/picture.png'
import './candidates.css'
import {addCandidate, getAllElections} from "../../../services/AdminService";
import ProgressComponent from "../../../components/ProgressComponent";

const Candidates = () => {
    let Candidate = {
        fName: '', lName: '', party: '', electionId: '', candidateImage: null, candidateSymbol: null
    }
    let Progress = {msg: 'Loading...', success: false, warn: false}
    const [candidate, setCandidate] = useState(Candidate);
    const [constituency, setConstituency] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [previewSymbol, setPreviewSymbol] = useState('');
    const [progress, setProgress] = useState(Progress);
    const [showProgress, setShowProgress] = useState(false);
    const [elections, setElections] = useState([]);

    const handleElectionChange = (id) => {
        setCandidate({...candidate, electionId: id})
        setConstituency(elections.filter((e, i) => e.electionId === id)[0].constituency.name)
    };

    const handleCandidateImage = (event) => {
        setPreviewImage(URL.createObjectURL(event.target.files[0]))
        setCandidate({...candidate, candidateImage: event.target.files[0]})
    }

    const handleCandidateSymbol = (event) => {
        setPreviewSymbol(URL.createObjectURL(event.target.files[0]))
        setCandidate({...candidate, candidateSymbol: event.target.files[0]})
    }

    const handleAddCandidate = () => {
        setShowProgress(true)
        setProgress(Progress)
        setProgress({...progress, msg: 'Adding Candidate'})
        if (candidate.fName !== '' && candidate.lName !== '' && candidate.electionId !== '' && candidate.candidateImage !== null && candidate.candidateSymbol !== null && candidate.party !== '') {
            let data = new FormData()
            data.set("fName", candidate.fName)
            data.set("lName", candidate.lName)
            data.set("electionId", candidate.electionId)
            data.set("candidateImage", candidate.candidateImage)
            data.set("candidateSymbol", candidate.candidateSymbol)
            data.set("party", candidate.party)

            addCandidate(data).then(r => {
                console.log(r)
                if (r) {
                    setCandidate(Candidate)
                    setPreviewSymbol('')
                    setPreviewImage('')
                    setConstituency('')
                    setProgress({...progress, msg: 'Added Candidate', success: true, warn: false})
                    let i = setInterval(() => {
                        closeProgress()
                        clearInterval(i)
                    }, 3000)
                }
            }).catch(err => {
                setProgress({...progress, msg: 'Failed Adding Candidate', warn: true, success: false})
            })
        }
        else {
            setProgress({...progress, msg: 'Fill all the details', warn: true, success: false})
        }

    }

    function closeProgress() {
        setProgress(Progress)
        setShowProgress(false)
    }

    useEffect(() => {
        return () => {
            getAllElections().then(r => {
                setElections(r.data)
                if (r.data.length === 0) {
                    setProgress({...progress, msg: 'No elections for adding candidates...!'})
                }
            }).catch(err => {
                console.log(err)
            })
        };
    }, []);

    return (<div className="container-fluid candidate-page bg-body-secondary">
        {showProgress ?
            <ProgressComponent onClose={() => closeProgress()} success={progress.warn} msg={progress.msg}
                               warn={progress.warn}/> :
            null}

        {elections.length >= 1 ?
            <div className="card bg-opacity-10 shadow-lg border border-dark-subtle rounded-4">
                <div className="row">
                    <div className="col-12">
                        <div
                            className="usr-image d-flex justify-content-center flex-column align-items-center mt-3 mb-3 object-fit">
                            <img className="img-thumbnail border-primary-subtle"
                                 src={previewImage || user_icon}
                                 alt="user" width="120px"
                                 height="120px"/>
                            <div className="img-c mb-3 mt-3 col-md-6 d-flex flex-column">
                                <label className="form-label text-center" htmlFor="formFile">Select Candidate
                                    image</label>
                                <input className="img-chooser form-control" type="file"
                                       id="formFile" onChange={(event) => handleCandidateImage(event)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="form-floating mb-3 rounded-2 border border-primary-subtle">
                            <input type="text" className="form-control" id="floatingInput" placeholder="First name"
                                   value={candidate.fName}
                                   onChange={(event) => setCandidate({...candidate, fName: event.target.value})}/>
                            <label htmlFor="floatingInput">First name</label>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="form-floating mb-3 rounded-2 border border-primary-subtle">
                            <input type="text" className="form-control" id="floatingInput1" placeholder="Last name"
                                   value={candidate.lName}
                                   onChange={(event) => setCandidate({...candidate, lName: event.target.value})}/>
                            <label htmlFor="floatingInput">Last name</label>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="form-floating mb-3 rounded-2 border border-primary-subtle">
                            <input type="text" className="form-control" id="floatingInput2" placeholder="Party"
                                   value={candidate.party}
                                   onChange={(event) => setCandidate({...candidate, party: event.target.value})}/>
                            <label htmlFor="floatingInput">Party</label>
                        </div>
                    </div>


                    <div className="col-6 col-sm-6">
                        <div className="form-group">
                            <div className="form-floating mb-3 rounded-2 border border-primary-subtle">
                                <input type="text" className="form-control" id="floatingInput"
                                       placeholder="Type to search..."
                                       list="datalist"
                                       value={constituency}
                                       onChange={(event) => handleElectionChange(event.target.value)}
                                />
                                <label htmlFor="floatingInput">Election</label>
                            </div>
                            <datalist id="datalist" className="bg-light ">
                                {elections.map((ec, i) => <option key={i} value={ec.electionId}>
                                    {ec.constituency.name}
                                </option>)}

                            </datalist>
                        </div>
                        <div className="const d-flex justify-content-center text-secondary">
                        </div>
                    </div>

                    <div className="col-12 ">
                        <div
                            className="usr-image d-flex justify-content-center flex-column align-items-center mt-3 mb-3 object-fit ">
                            <img className="img-thumbnail border-primary-subtle" src={previewSymbol || picture}
                                 alt="user "
                                 width="120px "
                                 height="120px "/>
                            <div className="img-c mb-3 mt-3 col-md-6 d-flex flex-column ">
                                <label className="form-label text-center " form="formFile1 ">Select Candidate
                                    Symbol</label>
                                <input className="img-chooser form-control" type="file"
                                       id="formFile1" onChange={(event) => handleCandidateSymbol(event)}/>
                            </div>
                            <p className="text-danger"></p>
                        </div>
                    </div>
                </div>
                <button type="submit " id="btn btn-primary" className="btn btn-primary"
                        onClick={() => handleAddCandidate()}>
                    Add Candidate
                </button>

            </div> :
            <>{progress.msg}</>}

    </div>);
}

export default Candidates;