import { connect } from 'react-redux';
import {Route} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { useEffect } from 'react';
import decode from 'jwt-decode';
import moment from 'moment';

import {deleteUserInfo} from '../../actions/user';

const PrivateRoute = ({ children, jwt, user, path, component }) => {
    let history = useHistory();
    useEffect(() => {
        if(!jwt || !(user.roles.includes('doctor') || user.roles.includes('head_department') || user.roles.includes('hospital_manager'))) {
            deleteUserInfo();
            history.push('/login');
        } else {
            const userFromToken = decode(jwt);
            if(moment().format('X') >= userFromToken.eat) {
                deleteUserInfo();
                history.push('/login');
            }
        }
    }, []);

    return (
        <Route exact path={path} component={jwt ? component : ''}>
            { children }
        </Route>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        jwt: state.user.jwt
    };
};

export default connect(mapStateToProps, {deleteUserInfo})(PrivateRoute);