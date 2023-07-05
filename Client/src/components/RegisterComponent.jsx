import React, {useState} from 'react';
import {sentVerificationCode, verifyOTP} from "../services/VoterService";

const RegisterComponent = ({voter, setVoter, constituencies, onRegister, modal}) => {

    const [constituency, setConstituency] = useState('');
    const [OTP, setOTP] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(false);
    const [validEmail, setValidEmail] = useState('');

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const handleConstituencyChange = (c) => {
        setVoter({...voter, constituencyId: parseInt(c)})
        setConstituency(constituencies.filter(co => co.id === parseInt(c))[0].name)
    }

    const validateEmail = (event) => {
        setVoter({...voter, email: event.target.value})
        if (event.target.value.match(isValidEmail)) {
            setValidEmail(true)
        }
        else {
            setValidEmail(false)
        }
    }

    const handleOtpSend = () => {
        let btn = document.getElementById('send-otp')
        btn.disabled = true
        sentVerificationCode(voter.email).then(r => {
            setOtpSent(true)
        }).catch(err => {
            btn.disabled = false
            console.log(err)
        })
    }

    const handleVerifyOTP = () => {
        verifyOTP(OTP).then(r => {
            console.log(r)
            setVerificationStatus(true)
            console.log(setVerificationStatus, isValidEmail)
        })
    }

    return (<div className="modal fade" id="r-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                 aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content w-100 card">
                <div className="d-flex justify-content-end mb-2">
                    <button type="button" className="btn-close" onClick={() => modal.hide()}>
                    </button>
                </div>
                <div className="row w-100 g-1">
                    <div className="col-12">
                        <div className="form-floating mb-1 rounded-2 border border-primary">
                            <input type="text" className="form-control" id="userId"
                                   placeholder="0x000000000000000000000000000" value={voter.userId}
                                   onChange={() => {
                                   }} disabled/>
                            <label htmlFor="floatingInput">User ID</label>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-floating mb-1 rounded-2 border border-primary">
                            <input type="text" className="form-control" id="fName"
                                   placeholder="Full name" value={voter.fName}
                                   onChange={(event) => setVoter({...voter, fName: event.target.value})}/>
                            <label htmlFor="floatingPassword">Full Name</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-1 rounded-2 border border-primary">
                            <input type="text" className="form-control" id="nationalId"
                                   placeholder="national id" value={voter.nationalId}
                                   onChange={(event) => setVoter({...voter, nationalId: event.target.value})}
                            />
                            <label htmlFor="floatingPassword">National ID</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-1  rounded-2 border border-primary">
                            <input type="password" className="form-control" id="password1"
                                   placeholder="Password" value={voter.password}
                                   onChange={(event) => setVoter({...voter, password: event.target.value})}
                            />
                            <label htmlFor="password1">Password</label>
                        </div>
                    </div>

                    <div className={verificationStatus ?
                        "col-12" :
                        "col-9"}>
                        <div className="input-group has-validation">
                            <div className={`form-floating mb-1 rounded-2 ${validEmail === '' || validEmail ?
                                ' border border-primary' :
                                ''}`}>
                                <input type="email" className={`form-control ${validEmail !== '' && !validEmail ?
                                    'is-invalid' :
                                    ''}`} id="email"
                                       placeholder="name@example.com" value={voter.email}
                                       onChange={(event) => validateEmail(event)}
                                />
                                <label htmlFor="floatingInput">Email address</label>
                                <div className="invalid-feedback">
                                    Invalid Email
                                </div>
                            </div>

                        </div>

                    </div>
                    {otpSent && !verificationStatus ?
                        <>
                            <div className="col-3">
                                <div className="form-floating mb-1  rounded-2 border border-primary">
                                    <input type="text" className="form-control" id="otp"
                                           placeholder="OTP" value={OTP}
                                           onChange={(event) => setOTP(event.target.value)}
                                    />
                                    <label htmlFor="floatingInput">OTP</label>
                                </div>
                            </div>
                            <div className="col-12 mb-1">
                                <button className="btn btn-success w-100" onClick={() => handleVerifyOTP()}>
                                    VERIFY OTP
                                </button>
                            </div>
                        </> :
                        null}
                    {!otpSent ?
                        <div className="col-3 d-flex justify-content-center align-items-center ml-3">
                            <button id="send-otp" className="btn btn-dark" onClick={() => handleOtpSend()}>SEND OTP
                            </button>
                        </div> :
                        null}


                    <div className="col-12">
                        <div className="form-floating mb-1 rounded-2 border border-primary">
                            <input name="constituency" className="form-control" list="datalistOptions"
                                   id="exampleDataList" placeholder="Type to search..."
                                   value={constituency}
                                   onChange={(event) => handleConstituencyChange(event.target.value)}
                            />
                            <datalist id="datalistOptions" className="bg-light">
                                {constituencies.map((c, i) => <option key={i} value={c.id}>
                                    {c.name}
                                </option>)}

                            </datalist>
                            <label htmlFor="floatingInput">Constituency</label>
                        </div>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary w-100 mt-1 mb-1"
                                disabled={!verificationStatus || !validEmail}
                                onClick={() => onRegister(voter)}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default RegisterComponent;
