import React from 'react';

const ProgressComponent = ({success, warn, msg, onClose}) => {
    return (<div className="progress-comp">
        <div className="card">
            {!success && !warn ? <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div> : warn ? <i className="fa-solid fa-circle-exclamation text-warning fs-1"></i> : success ?
                <i className="fa-solid fa-thumbs-up text-success fs-1"></i> : null}
            <span className="prg-msg mt-3">{msg}...</span>
            {warn ? <button className="btn btn-sm btn-outline-danger mt-4" onClick={onClose}>Close</button> : null}

        </div>
    </div>);
};

export default ProgressComponent;
