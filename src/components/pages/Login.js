import { Form, Input, Select, Button, message, Result} from 'antd';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import React, { useState } from 'react';

import { insertUserInfo, deleteUserInfo } from '../../actions/user';
import { login } from '../../axios/user';

const Option = Select.Option;

const LoginForm = (props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onLoginFormSubmit = ({email, password}) => {
        setLoading(true);
        const name = email.split('@')[0];
        const organization = email.split('@')[1].split('.')[0];
        console.log(name);
        console.log(organization);

        login(name, organization, password).then((response) => {
            const token = response.data.token;
            const user = jwt(token);
            props.insertUserInfo(token, user);
            props.history.push(`/${organization === 'dopmam' ? 'dopmam' : 'user' }/reports`);
        }).catch(() => {
            setLoading(false);
            message.error("Login Failed");
        });
    };

    return (
        <React.Fragment>
            <Form
                layout="vertical"
                form={form}
                onFinish={onLoginFormSubmit}
            >
                <Form.Item 
                    label="Email:"
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item 
                    label="Password:"
                    name="password"
                    rules={[{ required: true, message: 'Password is required' }]}
                >
                    <Input type="password" min="8" />
                </Form.Item>
                <Form.Item className="m-0">
                    <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
}

const ResultForm = (props) => {
    return (
        <React.Fragment>
            <Result
                status="warning"
                title={`Wellcome back, ${props.name}`}
                extra={
                    <Button type="primary" onClick={() => {props.deleteUserInfo()}}>
                        Sign out
                    </Button>
                }
            />
        </React.Fragment>
    );
}

const Login = (props) => {
    if(!props.jwt) {
        return (
            <div className="container">
                <div className="row" style={{paddingTop: '35vh'}}>
                    <div className="col-md-4 offset-md-4" style={{backgroundColor: 'white', padding: '24px'}}>
                        <LoginForm insertUserInfo={props.insertUserInfo} history={props.history}/>
                    </div>
                </div>
            </div> 
        );
    } else {
        return (
            <div className="container">
                <div className="row" style={{paddingTop: '30vh'}}>
                    <div className="col-md-6 offset-md-3" style={{backgroundColor: 'white'}}>
                        <ResultForm name={props.user.name} deleteUserInfo={props.deleteUserInfo} />
                    </div>
                </div>
            </div> 
        );
    }
};

const mapStateToProps = (state) => {
    return {
        jwt: state.user.jwt,
        user: state.user.user
    };
};

export default connect(mapStateToProps, {insertUserInfo, deleteUserInfo})(Login);