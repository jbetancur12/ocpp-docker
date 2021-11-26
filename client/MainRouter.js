import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Users from './user/Users';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import Menu from './core/Menu';
import Dashboard from './dashboard/Dashboard';
import Clients from './dashboard/Clients';
import Operations from './components/Operations';
import QRScanModule from './components/QRScan';
import NotFoundPage from './components/NotFound';
import Tabs from './components/stationsv2';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home} />
        {/* <Route path='/users' component={Users} /> */}
        <PrivateRoute path='/qr' component={QRScanModule} />
        <PrivateRoute path='/dashboard' component={Dashboard} />
        {/* <PrivateRoute path='/operations' component={Operations} /> */}
        {/* <PrivateRoute path='/clients' component={Clients} /> */}
        <Route path='/signup' component={Signup} />
        <Route path='/tabs' component={Tabs} />
        <Route path='/signin' component={Signin} />
        {/* <PrivateRoute path='/user/edit/:userId' component={EditProfile} /> */}
        {/* <Route path='/user/:userId' component={Profile} /> */}
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
};
export default MainRouter;
