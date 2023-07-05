import React, {useEffect, useState} from 'react';
import './homepage.css'
import LoginComponent from "../../components/LoginComponent.jsx";
import {Link, useNavigate} from "react-router-dom";
import RegisterComponent from "../../components/RegisterComponent";
import Web3Service from "../../services/Web3Service";
import {getAllConstituencies} from "../../services/AdminService";
import {registerVoter, voterLogin} from "../../services/VoterService";
import ProgressComponent from "../../components/ProgressComponent";

const HomePage = () => {
    let Voter = {
        userId: '', fName: '', nationalId: '', password: '', email: '', constituencyId: '', otp: ''
    }

    let Progress = {
        success: false, warn: false, msg: 'Loading...'
    }

    const [register, setRegister] = useState(false);
    const [constituencies, setConstituencies] = useState([]);
    const [voter, setVoter] = useState(Voter);
    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(Progress);
    const [rModal, setRModal] = useState('');
    const navigate = useNavigate();


    const onRegisterClick = () => {
        setRegister(!register)
        rModal.show()
    }

    const handleRegister = (voter) => {
        rModal.hide()
        setShowProgress(true)
        if (voter.userId !== '' && voter.fName !== '' && voter.nationalId !== '' && voter.password !== '' && voter.email !== '' && voter.constituencyId !== '') {
            setProgress({...progress, msg: "Registering Voter"})
            registerVoter(voter).then(r => {
                if (r) {
                    setVoter(Voter)
                    setProgress({...progress, success: true, msg: "Voter Registered"})
                    let i = setInterval(() => {
                        handleProgressClose()
                        clearInterval(i)
                    }, 3000)
                }
                else {
                    setProgress({...progress, msg: "Registration failed", warn: true})
                }
            }).catch(err => {
                setProgress({...progress, msg: "Registration failed", warn: true})
                console.log(err)
            })
        }
        else {
            setProgress({...progress, msg: "Please fill all the details...", warn: true})
            rModal.show()
        }
    }

    const handleLogin = (login) => {
        setShowProgress(true)
        if (login.nationalId !== '' && login.password !== '') {
            setProgress({...progress, msg: "Validating"})
            voterLogin(login).then(r => {
                console.log(r)
                setProgress({...progress, success: true, msg: 'Authenticated'})
                if (!r) {
                    setProgress({...progress, warn: true, msg: 'Invalid national Id / Password'})
                }
                else if (!r.isActive) {
                    setProgress({...progress, warn: true, msg: 'Account not verified'})
                }
                else {
                    navigate('user')
                }
            }).catch(err => {
                setProgress({...progress, warn: true, msg: err})
            })
        }
        else {
            setProgress({...progress, warn: true, msg: 'Please fill all the details'})
        }
    }

    useEffect(() => {
        return () => {
            new Web3Service().getCurrentAccount().then(a => {
                setRModal(new bootstrap.Modal('#r-modal'))
                setVoter({...voter, userId: a})
                getAllConstituencies().then(r => {
                    setConstituencies(r.data)
                })
            })

        };
    }, []);

    const handleProgressClose = () => {
        setProgress(Progress)
        setShowProgress(false)
    };
    return (<>
        <div className="background-overlay"></div>
        <div className="home-page">
            <nav className="navbar bg-transparent">
                <div className="container-fluid">
                    <a className="navbar-brand">
                        <i className="fa-solid fa-check-to-slot fs-3 px-2 text-dark opacity-75"></i>E-Ballot</a>
                    <div className="d-flex" role="search">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link nav-btn"
                                      aria-current="page" to="admin">
                                    <i className="fa-solid fa-user-shield"></i>
                                    &nbsp;Admin
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="login-container">
                <div className="login-cmp shadow-lg border">
                    <LoginComponent register={() => onRegisterClick()} onLogin={(login) => handleLogin(login)}/>
                    <RegisterComponent voter={voter} setVoter={setVoter} constituencies={constituencies}
                                       onRegister={(voter) => handleRegister(voter)} modal={rModal}/>
                </div>
            </div>
            {showProgress ?
                <ProgressComponent success={progress.success} warn={progress.warn} msg={progress.msg}
                                   onClose={() => handleProgressClose()}/> :
                null}
        </div>


    </>);
};

export default HomePage;