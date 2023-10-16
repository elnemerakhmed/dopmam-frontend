import React from 'react'
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterComponent = ({copyright, year}) => {
    return (
        <Footer className="site-footer">
            <div>{copyright} &copy; {year}</div>
        </Footer>
    );
};

FooterComponent.defaultProps = {
    copyright: "Anonymouse",
    year: 2021
};

export default FooterComponent;
