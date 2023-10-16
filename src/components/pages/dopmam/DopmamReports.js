import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Tabs, Result } from 'antd';

import UserLayout from '../../layouts/UserLayout';
import { getReports, dopmamChannels, getPatient } from '../../../axios/dopmam';

const { TabPane } = Tabs;

const NoContent = () => {
    return (
        <div className="padding white text-center">
            <Result 
                title="No data availabe"
                subTitle="Once found a matching, it will show here."
            />
        </div>
    );
};

const ReportCard = ({ report, channel, jwt, history }) => {
    const [patient, setPatient] = useState({});

    useEffect(() => {
        getPatient(report.patientNationalId, jwt, channel).then(({data}) => {
            setPatient(data);
        }).catch(() => {
        });
    }, [report]);

    return (
        <Card key={report.reportId} className="w-100 mb-2" onClick={() => { history.push(`/dopmam/reports/${channel}/${report.reportId}`) }}>
            <div className="row">
                <div className="col">
                    <h1>#{report.reportId}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 col-12">
                    <strong>Patient Id: </strong>
                    <span>{report.patientNationalId}</span>
                </div>
                <div className="col-sm-6 col-12">
                    <strong>Patient Name: </strong>
                    <span>{ `${patient.firstName ? patient.firstName : 'Loading ...'} ${patient.lastName ? patient.lastName : ''}` }</span> 
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div>
                        <strong>Medical History and Clinical Findings: </strong>
                    </div>
                    <span>{report.medicalHistoryAndClinicalFindings}</span>
                </div>
            </div>
        </Card>
    );
}

const UserReports = ({jwt, history, user}) => {
    const [reportList, setReportList] = useState([]);

    useEffect(() => {
        setReportList([]);

        dopmamChannels.forEach((channel) => {
            getReports(jwt, channel).then(({data}) => {
                data.forEach((obj) => {
                    obj.organization = channel.split('-')[1]
                });
                
                data.forEach((obj) => {
                    setReportList(reportList.concat(obj))
                });
            }).catch(() => {
            });
        });
    }, []);

    const getAllReports = () => {
        return reportList;
    }

    const getFinishedReports = () => {
        return reportList.filter((report) => report.financialCommitteeSignatures && report.financialCommitteeSignatures.length === 4);
    }

    const getRejectedReports = () => {
        return reportList.filter((report) => report.rejected && report.rejected === true);
    }

    const renderReports = (reports) => {
        function compare( a, b ) {
            if ( a.reportId > b.reportId ){
              return -1;
            }
            if ( a.reportId < b.reportId ){
              return 1;
            }
            return 0;
        };      
        
        return reports.sort(compare).map((report, index) => {
            return (
                <div key={index} className="col-12">
                    <ReportCard history={history} report={report} channel={report.organization} jwt={jwt}/>
                </div>
            );
        });
    }

    return (
        <UserLayout css="" path={[user.name, 'Reports']}>
            <div className="row">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="All Reports" key="1">
                        {
                            getAllReports().length > 0 ? renderReports(getAllReports()) : <NoContent />
                        }
                    </TabPane>
                    <TabPane tab="Finished" key="2">
                        {
                            getFinishedReports().length > 0 ? renderReports(getFinishedReports()) : <NoContent />
                        }
                    </TabPane>
                    <TabPane tab="Rejected" key="3">
                        {
                            getRejectedReports().length > 0 ? renderReports(getRejectedReports()) : <NoContent />
                        }                    
                    </TabPane>
                </Tabs>      
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

export default connect(mapStateToProps)(UserReports);