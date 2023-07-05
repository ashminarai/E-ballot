import React from 'react';

const ResultCard = ({candidate}) => {
    return (
        <div className="card">
            <div className="row">
                <div className="col-3">
                    {candidate.name}
                </div>
                <div className="col-3">
                    {candidate.voteCount}
                </div>
            </div>
        </div>
    );
};


export default ResultCard;
