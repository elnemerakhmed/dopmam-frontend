import { Layout, Menu, Avatar } from 'antd';
import React from 'react'
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { FolderAddOutlined, FileSearchOutlined, UserOutlined } from '@ant-design/icons';

import { deleteUserInfo } from '../../actions/user';

const { Header } = Layout;
const { SubMenu } = Menu;

const iconStyles = {
    position: 'relative',
    top: '-3px',
    marginRight: '5px',
    fontSize: '20px'
}

const HeaderComponent = ({user, roles, deleteUserInfo}) => {
    let history = useHistory();
    
    return (
        <Header>
            <div className="logo" onClick={() => {
                history.push('/');
            }}>
                <img src="/logo.png" style={{maxHeight: '40px'}} />
            </div>
            <Menu theme="dark" mode="horizontal">
                { roles.includes('doctor') && <Menu.Item key="1" onClick={() => { history.push('/user/reports/new'); }}><FolderAddOutlined style={iconStyles} /> New Report</Menu.Item> }
                <Menu.Item key="2"onClick={() => { history.push(`/${ user.organization === 'dopmam' ? 'dopmam' : 'user' }/reports`); }}><FileSearchOutlined style={iconStyles} /> Archive</Menu.Item>
                <SubMenu className="user-menu" key="user" title={
                    <React.Fragment>
                        <Avatar style={iconStyles} icon={<UserOutlined style={{...iconStyles, marginRight: '0px'}} />} />
                        <span style={{marginLeft: '5px'}}>{user.name}</span>
                    </React.Fragment>
                 } onClick={() => { deleteUserInfo(); history.push('/'); }}>
                    <Menu.Item key="3">Logout</Menu.Item>
                </SubMenu>
            </Menu>
        </Header>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        roles: state.user.user.roles
    };
};

export default connect(mapStateToProps, {deleteUserInfo})(HeaderComponent);