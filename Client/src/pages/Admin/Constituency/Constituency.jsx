import React, {useEffect, useState} from 'react';
import {addConstituency, deleteConstituency, getAllConstituencies} from "../../../services/AdminService.jsx";
import './constituency.css'

const Constituency = () => {
    const [name, setName] = useState('');
    const [invalidName, setInvalidName] = useState(true);
    const [constituencies, setConstituencies] = useState([]);

    const handleAddConstituency = () => {
        if (name !== '') {
            addConstituency({name: name}).then(res => {
                console.log("added constituency")
                getAllConstituency()
                setName('')
            }).catch(err => {
                console.log(err)
            })
        } else {
            setInvalidName(true)
        }

    }

    function getAllConstituency() {
        getAllConstituencies().then((r) => {
            setConstituencies(r.data)
            // console.log(r.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    function deleteConst(id) {
        console.log(id)
        deleteConstituency(id).then(r => {
            console.log(r)
            getAllConstituency()
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        return () => {
            getAllConstituency()
        };
    }, []);


    return <div className="container-fluid">
        <div className="container my-2">
            <table className="table mt-3 px-2">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Constituency Name</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr className="bg-body-tertiary">
                    <td valign={"middle"}>0</td>
                    <td valign={"middle"}>
                        <div>
                            <input type="email"
                                   className={invalidName ? 'form-control' : 'form-control is-invalid'}
                                   id="exampleFormControlInput1"
                                   value={name} onChange={(event) => {
                                setName(event.target.value);
                                event.target.value.length === 0 ? setInvalidName(true) : null
                            }}
                                   placeholder="constituency name"/>
                            <div id="validationServer03Feedback" className="invalid-feedback">
                                Please provide a valid Constituency.
                            </div>
                        </div>
                    </td>
                    <td valign={"middle"}>
                        <button className="btn btn-sm btn-outline-success btn-w-80"
                                onClick={() => handleAddConstituency()}>
                            <i className="fa-solid fa-plus"></i>&nbsp; SAVE
                        </button>
                    </td>
                </tr>
                {constituencies.map((item, index) => <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>
                        <button className="btn btn-sm btn-danger btn-w-80" onClick={() => deleteConst(item.id)}>
                            <i className="fa-regular fa-trash-can"></i>&nbsp; DELETE
                        </button>
                    </td>
                </tr>)}

                </tbody>
            </table>
        </div>
    </div>;
};

export default Constituency;