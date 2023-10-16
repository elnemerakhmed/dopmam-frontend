import React from 'react';
import { connect } from 'react-redux';

const Home = ({history, jwt, organization}) => {
    React.useEffect(() => {
        if(organization === 'dopmam') {
            history.push('dopmam/reports/');
        } else {
            history.push('user/reports/');
        }
    }, []);

    return (
        <React.Fragment>
        </React.Fragment>
    )
};


const mapStateToProps = (state) => {
    return {
        jwt: state.user.jwt,
        organization: state.user.user.organization
    };
};

export default connect(mapStateToProps)(Home);