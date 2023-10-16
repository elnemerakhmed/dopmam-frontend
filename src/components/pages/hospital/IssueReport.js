import { connect } from 'react-redux';
import React, {useState, useEffect} from 'react';
import { Typography, Form, Input, Select, Button, Alert, message } from 'antd';
import moment from 'moment';

import { getPatient, createNewPatient, createNewReport } from '../../../axios/hospital';
import UserLayout from '../../layouts/UserLayout';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Report = ({ jwt, history,  }) => {
    const [patientForm] = Form.useForm();
    const [reportForm] = Form.useForm();

    const [newPatient, setNewPatient] = useState(false);
    const [validPatient, setValidPatient] = useState(false);
    const [patientId, setPatientId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [insuranceNumber, setInsuranceNumber] = useState('');
    const [insuranceDueDate, setInsuranceDueDate] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [addPatientLoading, setAddPatientLoading] = useState(false);
    const [issueReportLoading, setIssueReportLoading] = useState(false);

    useEffect(() => {
        setNewPatient(false);
        setValidPatient(false);

        let timeoutId = 0;
        if(patientId > 0) {
            timeoutId = setTimeout(() => {
                getPatient(patientId, jwt).then(({data}) => {
                    const { firstName, lastName, insuranceNumber, insuranceDueDate, gender, dateOfBirth } = data;
                    setValidPatient(true);
                    setFirstName(firstName);
                    setLastName(lastName);
                    setInsuranceNumber(insuranceNumber);
                    setInsuranceDueDate(moment(insuranceDueDate).format('YYYY-MM-DD'));
                    setGender(gender);
                    setDateOfBirth(moment(dateOfBirth).format('YYYY-MM-DD'));
                }).catch(() => {
                    setNewPatient(true);
                });
            }, 1000);
        }
        return () => {
            clearTimeout(timeoutId);
        }
    }, [patientId, jwt])

    const onNewPatientSubmit = (patient) => {
        setAddPatientLoading(true);
        createNewPatient(patient, jwt).then(({data}) => {
            setValidPatient(true);
            setNewPatient(false);
            const id = patientId;
            setPatientId(0);
            setPatientId(id);
            message.success(data);
        }).catch(() => {
            setAddPatientLoading(false);
            message.error('Failed to Add Patient');
        });
    }

    const onReportFormSubmit = (report) => {
        setIssueReportLoading(true);
        createNewReport(patientId, report, jwt).then(({data}) => {
            setIssueReportLoading(false);
            message.success(`Report #${data} Successfully added.`);
            history.push('/user/reports');
        }).catch(() => {
            setIssueReportLoading(false);
            message.error('Failed to Add Report');
        });
    }

    return (
        <UserLayout css="has-padding white" path={['User', 'Reports', 'New']}>
            <Form 
                form={patientForm}
                layout="vertical"
                onFinish={onNewPatientSubmit}
            >
                <Title>Issue new Report</Title>
                {
                    newPatient &&
                    <div className="row">
                        <div className="col">
                            <Alert 
                                showIcon
                                message="Warning" 
                                description="This Patient does not exsist, please add his info to the system"
                                type="warning"
                                />
                            <br />
                        </div>
                    </div>
                }
                <div className="row">
                    <div className="col-md-6">
                        <Form.Item 
                            label="Patient National ID:" 
                            name="nationalId"
                            rules={[{ required: true, message: 'Please enter the National Id!' }]}
                            >
                            <Input placeholder="eg. 123456789" type="number" min="1" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-6">
                                {
                                    newPatient &&
                                    <Form.Item 
                                    label="First Name:"
                                    name="firstName"
                                    rules={[{ required: true, message: 'First Name is required!' }]}
                                    >
                                        <Input placeholder="eg. Ahmed" onChange={(e) => setFirstName(e.target.value)} />
                                    </Form.Item>
                                }
                                {
                                    !newPatient &&
                                    <Form.Item label="First Name:">
                                        <Input disabled value={firstName} />
                                    </Form.Item>
                                }
                            </div>
                            <div className="col-6">
                                {
                                    newPatient &&
                                    <Form.Item 
                                    label="Last Name:" 
                                    name="lastName"
                                    rules={[{ required: true, message: 'Last Name is required!' }]}>
                                        <Input placeholder="eg. Mortaja" disabled={!newPatient}  value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </Form.Item>
                                }
                                {
                                   !newPatient &&
                                   <Form.Item label="Last Name:">
                                       <Input disabled value={lastName} />
                                   </Form.Item>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        {
                            newPatient &&
                            <Form.Item 
                                label="Insurance Number:"
                                name="insuranceNumber"
                                rules={[{ required: true, message: 'Insurance Number is required!' }]}
                                >
                                    <Input type="number" placeholder="eg. 123456789" disabled={!newPatient}  />
                            </Form.Item>
                        }
                        {
                            !newPatient &&
                            <Form.Item label="Insurance Number:">
                                <Input disabled value={insuranceNumber} />
                            </Form.Item>
                        }
                    </div>
                    <div className="col-md-6">
                        {
                            newPatient &&
                            <Form.Item 
                                label="Insurance Expiration Date:" 
                                name="insuranceDueDate"
                                rules={[{ required: true, message: 'Insurance Expiration Date is required!' }]}
                            >
                            <Input type="date" disabled={!newPatient}  min={moment().format('YYYY-MM-DD')} />
                            </Form.Item>
                        }
                        {
                            !newPatient &&
                            <Form.Item label="Insurance Expiration Date:">
                                <Input disabled value={insuranceDueDate} />
                            </Form.Item>   
                        }
                    </div>
                    <div className="col-md-6">
                        {
                            newPatient &&
                            <Form.Item 
                                label="Gender:"
                                name="gender"
                                rules={[{ required: true, message: 'Gender is required!' }]}
                            >
                                <Select className="w-100" disabled={!newPatient} placeholder="Select a Gender">
                                    <Option value="" disabled="true">Select a Gender</Option>
                                    <Option value="MALE">Male</Option>
                                    <Option value="FEMALE">Female</Option>
                                </Select>
                            </Form.Item>          
                        } 
                        {
                            !newPatient &&
                            <Form.Item label="Gender:" >
                                <Select className="w-100" disabled value={gender}>
                                    <Option value="MALE">Male</Option>
                                    <Option value="FEMALE">Female</Option>
                                </Select>
                            </Form.Item>
                        }             
                    </div>
                    <div className="col-md-6">
                        {
                            newPatient &&
                            <Form.Item 
                                label="Date of Birth:"
                                name="dateOfBirth"
                                rules={[{ required: true, message: 'Gender is required!' }]}
                            >
                                <Input  type="date" disabled={!newPatient} max={moment().format('YYYY-MM-DD')} />
                            </Form.Item>
                        }
                        {
                            !newPatient &&
                            <Form.Item label="Date of Birth:">
                                <Input disabled value={dateOfBirth}/>
                            </Form.Item>
                        }
                    </div>
                    {
                        newPatient &&
                        <div className="col-12">
                            <Button type="primary" htmlType="submit" loading={addPatientLoading}>Add Patient</Button>
                            <br />
                            <br />
                        </div>
                    }
                </div>
            </Form>
            <Form 
                form={reportForm}
                layout="vertical"
                onFinish={onReportFormSubmit}
            >
                <div className="row">
                    <div className="col-12">
                        <Form.Item 
                            label="Medical History and Clinical Findings:"
                            name="medicalHistoryAndClinicalFindings"
                            rules={[{ required: true, message: 'Medical History and Clinical Findings are required!' }]}
                        >
                            <TextArea maxLength="500" cols="4" disabled={!validPatient}/>
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item 
                            label="Diagnosis:"
                            name="diagnosis"
                            rules={[{ required: true, message: 'Diagnosis is required!' }]}
                        >
                            <TextArea maxLength="500" cols="4" disabled={!validPatient}/>
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item 
                            label="Recommendation:"
                            name="recommendation"
                            rules={[{ required: true, message: 'Recommendation is required!' }]}
                        >
                            <TextArea maxLength="500" cols="4" disabled={!validPatient}/>
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Button type="primary" htmlType="submit" disabled={!validPatient} loading={issueReportLoading}>Issue Report</Button>
                    </div>
                </div>
            </Form>
        </UserLayout>
    );
};

const mapStateToProps = (state) => {
    return {
        jwt: state.user.jwt,
        user: state.user.user
    };
};

export default connect(mapStateToProps)(Report);