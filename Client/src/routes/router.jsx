import {createBrowserRouter} from "react-router-dom";
import HomePage from "../pages/Home/HomePage.jsx";
import AdminPage from "../pages/Admin/AdminPage.jsx";
import Elections from "../pages/Admin/Election/Elections.jsx";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard.jsx";
import Candidates from "../pages/Admin/Candidates/Candidates.jsx";
import Voters from "../pages/Admin/Voters/Voters.jsx";
import Constituency from "../pages/Admin/Constituency/Constituency.jsx";
import UserPage from "../pages/User/UserPage";
import ResultPageComponent from "../pages/Result/ResultPageComponent";
import ResultPage from "../pages/Admin/Results/Result";


export const RouterList = createBrowserRouter([{path: '', element: <HomePage/>}, {
    path: 'admin', element: <AdminPage/>, children: [{
        path: 'dashboard', element: <AdminDashboard/>,
    }, {
        path: 'election', element: <Elections/>
    }, {
        path: 'candidates', element: <Candidates/>
    }, {
        path: 'voters', element: <Voters/>
    }, {
        path: 'constituency', element: <Constituency/>
    }, {
        path: 'results', element: <ResultPage/>
    },]
}, {path: 'user', element: <UserPage/>,}, {path: 'result', element: <ResultPage/>}, {
    path: 'result/:id', element: <ResultPageComponent/>
},])