import React, {useEffect, useState} from 'react';
import './adminpage.css'
import {Outlet, useNavigate} from "react-router-dom";
import vote from '../../assets/images/vote.png'
import {checkIsAdmin} from "../../services/AdminService";
import AdminLogin from "../../components/AdminLogin";

const AdminPage = () => {

    let _prg = {
        prgMsg: "Loading..", warn: false, success: false
    }

    const [isAdmin, setIsAdmin] = useState(false);
    const [page, setPage] = useState(0);
    const [title, setTitle] = useState("Admin Dashboard");
    const [login, setLogin] = useState(false);
    const [prg, setPrg] = useState(_prg);
    const navigate = useNavigate();


    const handleTabChange = (page) => {
        switch (page) {
            case 0:
                navigate('dashboard')
                setTitle('Admin Dashboard')
                setPage(0);
                break
            case 1:
                navigate('election')
                setTitle('Elections Management')
                setPage(1);
                break
            case 2:
                navigate('candidates')
                setTitle('Candidate Management')
                setPage(2)
                break
            case 3:
                navigate('voters')
                setTitle('Voters Management')
                setPage(3)
                break
            case 4 :
                navigate('constituency')
                setTitle('Constituency Management')
                setPage(4)
                break;
            case 5 :
                navigate('results')
                setTitle('Published Election Results')
                setPage(5)
                break;
        }
    }

    const handleLogout = () => {
        localStorage.setItem('admin', '0')
        window.location.replace('/')
    }

    const checkAdmin = () => {
        setPrg({..._prg, prgMsg: "Checking is Admin..."})
        checkIsAdmin().then(r => {
            setIsAdmin(r)
            if (r) {
                setPrg({..._prg, prgMsg: ""})
                // setLogin(true)
            }
            else {
                setPrg({..._prg, prgMsg: "Not Connected as an Admin Account"})
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const onLogin = (v) => {
        if (parseInt(v)) {
            setLogin(true)
            handleTabChange(0)
            localStorage.setItem('admin', '1')
        }
    }

    useEffect(() => {
        return () => {
            if (parseInt(localStorage.getItem('admin'))) setLogin(true)
            checkAdmin()
        };
    }, []);


    return (<div className="container-fluid admin-page p-0 m-0">
        {isAdmin && login ?
            (<div className="d-flex h-100">
                <div
                    className="nav d-flex flex-column nav-pills p-4 align-items-center tabs shadow"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical">
                    <img src={vote} className="mb-5" alt="" width={100} height={100}/>

                    <button className={page === 0 ?
                        "btn btn-primary" :
                        "btn"} id="v-pills-home-tab" type="button"
                            role="tab" onClick={() => handleTabChange(0)}>
                        <i className="fa-solid fa-gauge-high"></i>&nbsp; Dashboard
                    </button>
                    <button className={page === 1 ?
                        "btn btn-primary" :
                        "btn"} id="v-pills-profile-tab" type="button"
                            role="tab" onClick={() => handleTabChange(1)}>
                        <i className="fa-solid fa-check-to-slot"></i> &nbsp;Elections
                    </button>
                    <button className={page === 2 ?
                        "btn btn-primary" :
                        "btn"} id="v-pills-messages-tab" type="button"
                            role="tab" onClick={() => handleTabChange(2)}>
                        <i className="fa-solid fa-users-gear"></i>&nbsp; Candidates
                    </button>
                    <button className={page === 3 ?
                        "btn btn-primary" :
                        "btn"} id="v-pills-voters-tab" type="button"
                            role="tab" onClick={() => handleTabChange(3)}>
                        <i className="fa-solid fa-users-viewfinder"></i>&nbsp; Voters
                    </button>
                    <button className={page === 4 ?
                        "btn btn-primary" :
                        "btn"} id="v-pills-settings-tab" type="button"
                            role="tab" onClick={() => handleTabChange(4)}>
                        <i className="fa-solid fa-map-location-dot"></i>&nbsp; Constituency
                    </button>
                    <button className={page === 5 ?
                        "btn btn-primary" :
                        "btn"} id="v-pills-settings-tab" type="button"
                            role="tab" onClick={() => handleTabChange(5)}>
                        <i className="fa-solid fa-square-poll-vertical"></i>&nbsp; Results
                    </button>
                </div>
                <div className="tab-content contents bg-body-tertiary" id="v-pills-tabContent">
                    <nav className="navbar bg-primary sticky-top shadow-sm">
                        <div className="container-fluid d-flex justify-content-center align-items-center px-3">
                            <div className="h4 title text-center text-white mx-3 mt-1 flex-grow-1">{title}</div>
                            <button className="btn btn-sm btn-warning" onClick={() => handleLogout()}>
                                <i className="fa-solid fa-right-from-bracket"></i> Logout
                            </button>
                        </div>
                    </nav>
                    <div className="content-outlet">
                        <Outlet/>
                    </div>
                </div>
            </div>) :
            (<div>
                {prg.prgMsg}
            </div>)}

        {isAdmin && !login ?
            <div className="admin-login"><AdminLogin onLogin={(v) => onLogin(v)}/></div> :
            null}

    </div>);
};

export default AdminPage;