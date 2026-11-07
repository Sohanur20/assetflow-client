import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import PrivateRoute from './PrivateRoute';
import HRRoute from './HRRoute';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import JoinEmployee from '../pages/Auth/JoinEmployee';
import JoinHR from '../pages/Auth/JoinHR';
import MyAssets from '../pages/Employee/MyAssets';
import RequestAsset from '../pages/Employee/RequestAsset';
import MyTeam from '../pages/Employee/MyTeam';
import AssetList from '../pages/HR/AssetList';
import AddAsset from '../pages/HR/AddAsset';
import AllRequests from '../pages/HR/AllRequests';
import MyEmployees from '../pages/HR/MyEmployees';
import AddEmployee from '../pages/HR/AddEmployee';
import Payment from '../pages/Payment/Payment';
import Packages from '../pages/Packages/Packages';
import Profile from '../pages/Profile/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-slate-500">The page you are looking for could not be loaded.</p>
        <a href="/" className="af-btn-primary">Back to Home</a>
      </div>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'join-employee', element: <JoinEmployee /> },
      { path: 'join-hr', element: <JoinHR /> },
      {
        path: 'my-assets',
        element: <PrivateRoute><MyAssets /></PrivateRoute>,
      },
      {
        path: 'request-asset',
        element: <PrivateRoute><RequestAsset /></PrivateRoute>,
      },
      {
        path: 'my-team',
        element: <PrivateRoute><MyTeam /></PrivateRoute>,
      },
      {
        path: 'asset-list',
        element: <HRRoute><AssetList /></HRRoute>,
      },
      {
        path: 'add-asset',
        element: <HRRoute><AddAsset /></HRRoute>,
      },
      {
        path: 'all-requests',
        element: <HRRoute><AllRequests /></HRRoute>,
      },
      {
        path: 'my-employees',
        element: <HRRoute><MyEmployees /></HRRoute>,
      },
      {
        path: 'add-employee',
        element: <HRRoute><AddEmployee /></HRRoute>,
      },
      {
        path: 'payment',
        element: <HRRoute><Payment /></HRRoute>,
      },
      {
        path: 'packages',
        element: <HRRoute><Packages /></HRRoute>,
      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile /></PrivateRoute>,
      },
    ],
  },
]);

export default router;
