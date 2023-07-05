import React from 'react';

const IMG = import.meta.env.VITE_IMAGE
const CandidateCard = props => {

    return (<div className="card shadow w-100 mt-2">
        <div className="row">
            <div className="col-3">
                <img className="img-thumbnail border-primary" src={IMG + props.candidate.candidateImage}
                     alt="candidateImage" width="100" height="100"/>
            </div>
            <div className={props.vote ?
                "col-3" :
                "col-6"}>
                <div className="d-flex flex-column">
                    <span className="candidate-name">{props.candidate.fName} {props.candidate.lName}</span>
                    <span className="candidate-party">{props.candidate.party}</span>
                </div>

            </div>
            <div className="col-3">
                <img className="img-thumbnail border-primary" src={IMG + props.candidate.candidateSymbol}
                     alt="candidateImage" width="100px" height="100px"/>
            </div>
            {props.result ?
                <div
                    className="vote-container">
                     <span
                         className="text-warning rounded-5 border border-dark px-2 bg-dark shadow">{props.candidate.votes}</span>
                </div> :
                null}


            {props.vote ?
                <div className="col-2 d-flex justify-content-center align-items-center">
                    <button className="btn btn-danger mt-2" onClick={() => props.onVote(props.candidate.id)}>Vote
                    </button>
                </div> :
                null}

        </div>
    </div>);
};


export default CandidateCard;
