import React from 'react';
import {formatDate} from "../services/AdminService";
import CandidateCard from "./CandidateCard";

const ElectionReport = ({election = {}}) => {

    return (<div className="election-report">
        <div className="h1">Election&nbsp;Report</div>
        <hr/>
        <table className="table table-bordered mt-3">
            <thead>
            <th colSpan="2" className="fs-4 text-center table-primary">Election&nbsp;Details</th>
            </thead>
            <tbody>
            <tr>
                <td>id</td>
                <td>{election.electionId}</td>
            </tr>
            <tr>
                <td>Constituency</td>
                <td>{election.constituency?.name}</td>
            </tr>
            <tr>
                <td>Start Date</td>
                <td>{formatDate(election.startDate)}</td>
            </tr>
            <tr>
                <td>End Date</td>
                <td>{formatDate(election.endDate)}</td>
            </tr>
            <tr>
                <td>Current Status</td>
                <td>{election.status ?
                    "Active" :
                    "Not Active"}</td>
            </tr>
            <tr>
                <td>Result Status</td>
                <td>{election.result ?
                    "Published" :
                    "Not Published"}</td>
            </tr>
            <tr>
                <td>Total Votes Casted</td>
                <td>{election.votes}</td>
            </tr>
            <tr className="text-center ">
                <td colSpan="2" className="text-bg-secondary fw-bold fs-4">Candidates</td>
            </tr>
            {election.candidates.length >= 1 ?
                <>{election.candidates.map((c, i) => <tr key={i}>
                    <td colSpan="2">
                        <div className="px-3 py-2 mx-2">
                            <CandidateCard candidate={c}/>
                        </div>
                    </td>
                </tr>)}</> :
                <tr>
                    <td colSpan="2">No Candidates present for this Election</td>
                </tr>}

            <tr className="text-center ">
                <td colSpan="2" className="text-bg-warning fw-bold fs-4">Voters</td>
            </tr>
            {election.voters.length >= 1 ?
                <>{election.voters.map((v, i) => <tr key={i}>
                    <td width="10%">{i + 1}</td>
                    <td>{v}</td>
                </tr>)}</> :
                <tr>
                    <td colSpan="2">No Voters had voted in this election</td>
                </tr>}

            </tbody>
        </table>
    </div>);
};


export default ElectionReport;
