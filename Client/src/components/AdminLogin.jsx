import React, {useState} from 'react';
import {adminLogin} from "../services/AdminService";
import Blockchain from "../assets/images/c.gif";


const AdminLogin = (props) => {
    const [uName, setUName] = useState('admin');
    const [pwd, setPwd] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [progress, setProgress] = useState(false);
    const handleLogin = () => {
        setProgress(true)
        setErrorMsg('')
        if (uName !== '' && pwd !== '') {
            adminLogin({pwd: pwd}).then(r => {
                if (parseInt(r)) {
                    props.onLogin(r)
                }
                else {
                    setProgress(false)
                    setErrorMsg('Incorrect Password')
                }
            }).catch(err => {
                setProgress(false)
                setErrorMsg('Unable to connect with blockchain')
                console.log(err)
            })
        }
        else {
            setProgress(false)
            setErrorMsg('Fill all the fields')
        }
    }
    return (
        <div className="admin-login" style={{
            backgroundImage: `url(${Blockchain})`,
    
        }}>
            <div className="container-fluid admin-login-container">
        <div className="card shadow-lg p-4">
            <div className="h1 mb-4 mt-3 fw-bold">Login</div>

            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder="national id" value={uName}
                       onChange={(event) => setUName(event.target.value)} disabled/>
                <label htmlFor="floatingInput">User name</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={pwd}
                       onChange={(event) => setPwd(event.target.value)}/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="d-flex flex-column align-items-center small text-danger mt-2">
                {progress ?
                    <progress></progress> :
                    null}
                {errorMsg}
            </div>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-primary mt-3" onClick={() => handleLogin()}>Login</button>
            </div>
        </div>
    </div>
    </div>);
};

export default AdminLogin;
