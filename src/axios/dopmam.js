import axios from "axios";
import moment from "moment";

export const dopmamChannels = ['dopmam-shifa', 'dopmam-naser'];

export const getPatient = (id, jwt, channel) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/dopmam/patients/getPatient",
        data: {
            id,
            channel: `dopmam-${channel}`
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const getReports = (jwt, channel) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/dopmam/reports",
        data: {
            channel
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
}

export const getReport = (id, jwt, channel) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/dopmam/report",
        data: {
            id,
            channel: `dopmam-${channel}`
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const approveReport = (id, country, city, hospital, dept, date, coverage, jwt, channel) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/dopmam/report/sign",
        data: {
            id,
            country,
            city,
            hospital,
            dept,
            date: moment(date).format('x'),
            coverage: parseFloat(coverage),
            channel: `dopmam-${channel}`,
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};

export const rejectReport = (id, jwt, channel) => {
    return axios({
        baseURL: process.env.REACT_APP_SERVER_URL,
        method: "POST",
        url: "/dopmam/report/reject",
        data: {
            id,
            channel: `dopmam-${channel}`
        },
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
};