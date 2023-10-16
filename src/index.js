import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { reducers } from './reducers/user';
import PrivateRoute from './components/routes/PrivateRoute';
import DoctorRoute from './components/routes/DoctorRoute';
import DopmamRoute from './components/routes/DopmamRoute';
import HospitalRoute from './components/routes/HospitalRoute';
import Login from './components/pages/Login';
import IssueReport from './components/pages/hospital/IssueReport';
import UserReports from './components/pages/hospital/UserReports';
import DopmamReports from './components/pages/dopmam/DopmamReports';
import Home from './components/pages/Home';
import UserReportDetails from './components/pages/hospital/UserReportDetails';
import DopmamReportDetails from './components/pages/dopmam/DopmamReportDetails';

import "antd/dist/antd.css";
import './styles/site.css';

const persistConfig = {
    key: 'DOPMAM_APPLICATION',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers)
const store = createStore(persistedReducer);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading="null" persistor={persistStore(store)}>
            <Router>
                <Switch>
                    <PrivateRoute exact path='/' component={Home} />
                    <Route exact path='/login' component={Login} />
                    <DoctorRoute exact path="/user/reports/new" component={IssueReport} />
                    <HospitalRoute exact path="/user/reports" component={UserReports} />
                    <HospitalRoute exact path="/user/reports/:id" component={UserReportDetails} />
                    <DopmamRoute exact path="/dopmam/reports" component={DopmamReports} />
                    <DopmamRoute exact path="/dopmam/reports/:channel/:id" component={DopmamReportDetails} />
                    <Route path='*' component={Home} />
                </Switch>
            </Router>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);