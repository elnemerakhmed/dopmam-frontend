import { useEffect } from 'react';
import { connect } from 'react-redux';
import {Route} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import decode from 'jwt-decode';
import moment from 'moment';

import {deleteUserInfo} from '../../actions/user';

const PrivateRoute = ({ children, jwt, path, component }) => {
    let history = useHistory();

    useEffect(() => {   
        if(!jwt) {
            deleteUserInfo();
            history.push('/login');
        } else {
            const user = decode(jwt);
            if(moment().format('X') >= user.eat) {
                deleteUserInfo();
                history.push('/login');
            }
        }
    }, []);

    return (
        <Route exact path={path} component={jwt ? component : ''}>
            { children }
        </Route>
    )
};

const mapStateToProps = (state) => {
    return {
        jwt: state.user.jwt
    };
};

export default connect(mapStateToProps, {deleteUserInfo})(PrivateRoute);