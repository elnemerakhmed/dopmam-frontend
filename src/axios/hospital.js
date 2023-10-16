import axios from "axios";
import moment from 'moment';

export const getPatient = (id, jwt) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/patients/getPatient",
        data: {
            id
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const createNewPatient = (patient, jwt) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/patients/addPatient",
        data: {
            ...patient,
            nationalId: parseFloat(patient.nationalId),
            insuranceNumber: parseFloat(patient.insuranceNumber),
            insuranceDueDate: parseInt(moment(patient.insuranceDueDate).format("x")),
            dateOfBirth: parseInt(moment(patient.dateOfBirth).format("x"))
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const createNewReport = (id, report, jwt) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/report/new",
        data: {
            patientNationalId: parseFloat(id),
            reportDate: parseInt(moment().format("x")),
            medicalHistoryAndClinicalFindings: report.medicalHistoryAndClinicalFindings,
            diagnosis: report.diagnosis,
            recommendation: report.recommendation
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const getReports = (jwt) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/reports",
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
}

export const getReport = (id, jwt) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/report",
        data: {
            id
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const approveReport = (id, jwt) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/report/sign",
        data: {
            id
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const rejectReport = (id, jwt) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/report/reject",
        data: {
            id
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};
