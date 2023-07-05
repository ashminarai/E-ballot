import React from 'react';

const MyComponent = ({prop}) => {
    return (
        <div>
            <div className={`card ${prop.bg} rounded-4 shadow-lg`}>
                <div className="title fs-4">
                    <i className={`${prop.icon} fa-solid fs-2 px-2 pe-3`}></i> {prop.title}
                </div>
                <hr/>
                <div className="count w-100 fs-3 d-flex justify-content-end pe-3">
                    {prop.count}
                </div>
            </div>
        </div>
    );
};

export default MyComponent;
