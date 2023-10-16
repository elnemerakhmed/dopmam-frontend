import React, {useEffect, useState} from 'react';
import { Typography, Form, Input, Select, Button, message, Drawer, List } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

import { getPatient, getReport, approveReport, rejectReport } from '../../../axios/hospital';
import UserLayout from '../../layouts/UserLayout';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ApproveOnly = ({ id, jwt, updateReport, setUpdateReport, loading, setLoading }) => {
    const onApprove = () => {
        setLoading(true);
        approveReport(id, jwt).then(() => {
            message.success('Report Approved')
            setUpdateReport(!updateReport);
        }).catch(() => {
            message.error('Error While Approving');
            setLoading(false);
        });
    }

    return (
        <React.Fragment>
            <Button type="primary" onClick={() => {onApprove()}} loading={loading}>Approve</Button>
        </React.Fragment>
    );
};


const RejectOnly = ({ id, jwt, updateReport, setUpdateReport, loading, setLoading }) => {
    const onReject = () => {
        setLoading(true);
        rejectReport(id, jwt).then(() => {
            message.success('Report Rejected')
            setUpdateReport(!updateReport);
        }).catch(() => {
            message.error('Error While Approving');
            setLoading(false);
        });
    }

    return (
        <React.Fragment>
            <Button type="primary" danger onClick={() => {onReject()}} loading={loading}>Reject</Button>
        </React.Fragment>
    );
};

const History = ({ setDrawerOpened }) => {
    return (
        <React.Fragment>
            <Button type="ghost" onClick={() => {setDrawerOpened(true)}} >History</Button>
        </React.Fragment>
    );
};

const ReportDetails = ({id, jwt, updateReport, setUpdateReport, user}) => {
    const [report, setReport] = useState({});
    const [patient, setPatient] = useState({});
    const [updatePatient, setUpdatePatient] = useState(false);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getReport(id, jwt).then(({data}) => {
            setReport(data);
            setUpdatePatient(!updatePatient);
        })
    }, [updateReport]);

    useEffect(() => {
        if(report.patientNationalId <= 0) {
            return;
        }

        getPatient(report.patientNationalId, jwt).then(({data}) => {
            setPatient(data);
        });
    }, [updatePatient])

    const renderTransferDetails = () => {
        if(report.transferToCountry === undefined) {
            return 'No transfer Details yet.';
        } else {
            return `${report.transferToCountry}, ${report.transferToCity}, ${report.transferToHospital}, ${report.transferToDepartment} at ${report.transferDueDate}`;
        }
    }

    const renderApproveRejectForms = () => {
        if(
            (user.roles.includes('head_department') && !report.headOfDepartmentSignature) ||
            (user.roles.includes('hospital_manager') && !report.hospitalManagerSignature)
        ) {
            return (
                <React.Fragment>
                    <div style={{ display: 'inline' }}>
                        <ApproveOnly id={report.reportId} jwt={jwt} updateReport={updateReport} setUpdateReport={setUpdateReport} loading={loading} setLoading={setLoading} />
                    </div>
                    <div style={{ display: 'inline', marginLeft: '10px' }}>
                        <RejectOnly id={report.reportId} jwt={jwt} updateReport={updateReport} setUpdateReport={setUpdateReport} loading={loading} setLoading={setLoading}/>
                    </div>
                    <div style={{ display: 'inline', marginLeft: '10px' }}>
                        <History setDrawerOpened={setDrawerOpened} />
                    </div>
                </React.Fragment>
            )
        } else {
            return <History setDrawerOpened={setDrawerOpened} />;
        }
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <Form 
                    layout="vertical"
                    >
                    <Title>Report #{report.reportId}</Title>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item label="Patient National ID:" >
                                <Input disabled value={report.patientNationalId}/>
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-6">
                                    <Form.Item label="First Name:">
                                        <Input disabled value={patient.firstName}/>
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item label="Last Name:">
                                        <Input disabled value={patient.lastName} />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <Form.Item label="Insurance Number:">
                                <Input disabled value={patient.insuranceNumber}/>
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item label="Insurance Expiration Date:">
                                <Input disabled  value={moment(patient.insuranceDueDate).format('YYYY-MM-DD')}/>
                            </Form.Item> 
                        </div>
                        <div className="col-md-6">
                            <Form.Item label="Gender:" >
                                <Select className="w-100" disabled value={patient.gender} >
                                    <Option value="MALE">Male</Option>
                                    <Option value="FEMALE">Female</Option>
                                </Select>
                            </Form.Item>           
                        </div>
                        <div className="col-md-6">
                            <Form.Item label="Date of Birth:">
                                <Input disabled value={moment(patient.dateOfBirth).format('YYYY-MM-DD')}/>
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item label="Coverage:">
                                <Input disabled value={report.coverage}/>
                            </Form.Item>
                        </div>
                        <div className="col-md-12">
                            <Form.Item label="Transfer Details:">
                                <TextArea cols="4" disabled value={renderTransferDetails()}/>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Form.Item label="Medical History and Clinical Findings:">
                                <TextArea cols="4" disabled value={report.medicalHistoryAndClinicalFindings}/>
                            </Form.Item>
                        </div>
                        <div className="col-12">
                            <Form.Item label="Diagnosis:">
                                <TextArea cols="4" disabled value={report.diagnosis}/>
                            </Form.Item>
                        </div>
                        <div className="col-12">
                            <Form.Item label="Recommendation:">
                                <TextArea cols="4" disabled value={report.recommendation}/>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {
                        renderApproveRejectForms()
                    }
                </div>
            </div>
            <ReportHistory user={user} report={report} drawerOpened={drawerOpened} setDrawerOpened={setDrawerOpened}/>
        </React.Fragment>
    );
};

const ReportHistory = ({ user, report, drawerOpened, setDrawerOpened }) => {
    const [approvalList, setApprovalList] = useState([]);

    useEffect(() => {
        updateApprovalList();
    }, [report])

    const reportStatus = () => {
        if(report.rejected && report.rejected === true) {
            return 'Rejected';
        } else if(report.financialCommitteeSignatures && report.financialCommitteeSignatures.length === 4) {
            return 'Finished';
        } else {
            return 'Pending';
        }
    };

    const updateApprovalList = () => {
        let clone = [
            {
                title: 'Doctor',
                description: 'Pending'
            },
            {
                title: 'Head Department',
                description: 'Pending'
            },
            {
                title: 'Hospital Manager',
                description: 'Pending'
            },
            {
                title: 'Dopmam Medical Lead',
                description: 'Pending'
            },
            {
                title: 'Dopmam Medical',
                description: 'Pending'
            },
            {
                title: 'Dopmam Financial Lead',
                description: 'Pending'
            },
            {
                title: 'Dopmam Financial',
                description: 'Pending'
            }
        ];

        if(report.doctorSignature) {
            clone[0] = {
                title: 'Doctor',
                description: report.doctorSignature
            }
        };

        if(report.headOfDepartmentSignature) {
            clone[1] = {
                title: 'Head Department',
                description: report.headOfDepartmentSignature
            }
        };

        if(report.hospitalManagerSignature) {
            clone[2] = {
                title: 'Hospital Manager',
                description: report.hospitalManagerSignature
            }
        };

        if(report.medicalCommitteeSignatures && report.medicalCommitteeSignatures.length > 0) {
            clone[3] = {
                title: 'Dopmam Medical Lead',
                description: report.medicalCommitteeSignatures[0]
            };

            if(report.medicalCommitteeSignatures.length > 1) {
                const dopmamMedicalMembers = report.medicalCommitteeSignatures.slice(1);
                clone[4] = {
                    title: 'Dopmam Medical',
                    description: dopmamMedicalMembers.join(', ')
                };
            }
        };

        if(report.financialCommitteeSignatures && report.financialCommitteeSignatures.length > 0) {
            clone[5] = {
                title: 'Dopmam Financial Lead',
                description: report.financialCommitteeSignatures[0]
            }

            if(report.financialCommitteeSignatures.length > 1) {
                const dopmamFinancialMembers = report.financialCommitteeSignatures.slice(1);
                clone[6] = {
                    title: 'Dopmam Financial',
                    description: dopmamFinancialMembers.join(', ')
                };
            }
        };

        if(report.rejected) {
            const filtered = clone.filter((e) => e.description !== 'Pending');
            const rejectedByKey = filtered[filtered.length - 1].title;
            clone.filter((e) => e.title === rejectedByKey).forEach((c) => c.description = `${c.description} (Rejected)`);
            clone.filter((e) => e.description === 'Pending').forEach((c) => c.description = `Rejected by: ${rejectedByKey}`);
        }

        setApprovalList(clone);
    };

    return (
        <React.Fragment>
            <Drawer
                placement="left"
                title={`Report #${report.reportId} History`}
                closable={true}
                onClose={() => setDrawerOpened(false)}
                visible={drawerOpened}
            >
                <div className="row">
                    <div className="col mb-3">
                        <Button className="w-100" type={reportStatus() !== 'Finished' ? 'default' : 'primary'} danger={reportStatus() === 'Rejected'}>{reportStatus()}</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <strong>Issued By: </strong>
                        <p>{`${report.doctorSignature}@${
                            user.organization
                        }.moh.ps`}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <strong>Department: </strong>
                        <p>{report.doctorDepartment}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="row">
                        <strong>Issued At: </strong>
                        <p>{moment(report.reportDate).format('YYYY-MM-DD')}</p>
                    </div>
                </div>
                <div className="row">
                    <strong>Approvals chain: </strong>
                </div>
                <div className="row"
                >
                    <div className="col">
                        <List
                            itemLayout="horizontal"
                            dataSource={approvalList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                    title={item.title}
                                    description={`${item.description} ${item.status == 'rejected'? ' (rejected)' : ''}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>                    
                </div>
            </Drawer>
        </React.Fragment>
    );
};

const UserReportDetails = ({ jwt, user, match }) => {
    const [updateReport, setUpdateReport] = useState(false);

    return (
        <UserLayout css="has-padding white" path={['User', 'Reports', `Report #${match.params.id}`]}>
            <div className="row">
                <div className="col">
                    <ReportDetails id={match.params.id} jwt={jwt} user={user} updateReport={updateReport} setUpdateReport={setUpdateReport} />
                </div>
            </div>
        </UserLayout>
    );
};

const mapStateToProps = (state) => {
    return {
        jwt: state.user.jwt,
        user: state.user.user
    };
};

export default connect(mapStateToProps)(UserReportDetails);