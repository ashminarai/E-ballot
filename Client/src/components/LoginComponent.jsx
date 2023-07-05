import React, {useState} from 'react';

const LoginComponent = ({register, onLogin}) => {
    let Login = {nationalId: '', password: ''}
    const [login, setLogin] = useState(Login);

    return (<div className="container-fluid">
        <div className="container">
            <div className="h1 mb-4 mt-3 fw-bold">Login</div>

            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder="national id"
                       value={login.nationalId}
                       onChange={(event) => setLogin({...login, nationalId: event.target.value})}
                />
                <label htmlFor="floatingInput">National Id</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                       value={login.password}
                       onChange={(event) => setLogin({...login, password: event.target.value})}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-primary mt-3" onClick={() => onLogin(login)}>Login</button>
            </div>
            <div className="reg-txt">
                Don't have an account
                <button type="button" className="btn btn-link" onClick={() => register()}>Register</button>
            </div>
        </div>
    </div>);
};

export default LoginComponent;