import React, {useEffect, useState} from 'react';
import './result-page.css'
import {getAllElections} from "../../../services/AdminService";
import {Link} from "react-router-dom";

const ResultPage = () => {

    const [elections, setElections] = useState([]);

    useEffect(() => {
        return () => {
            getAllElections().then(r => {
                let _elections = r.data
                setElections(_elections.filter((e, i) => e.result === true))
            })
        };
    }, []);

    return (<div className="container-fluid result-page">
        <div className="container mt-3">
            {elections.length >= 1 ?
                <>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Election Id</th>
                            <th scope="col">Constituency</th>
                            <th scope="col">View result</th>
                        </tr>
                        </thead>
                        <tbody className="table-group-divider">
                        {elections.map((e, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td className="election-data">{e.electionId}</td>
                            <td className="election-data">{e.constituency.name}</td>
                            <td>
                                <Link className="btn btn-sm btn-warning btn-w-80"
                                      to={'/result/' + e.electionId} target="_blank">
                                    <i
                                        className="fa-solid fa-chart-simple"></i>&nbsp; View
                                </Link>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                </> :
                <div>No published results</div>}
        </div>
    </div>);
};

export default ResultPage;
