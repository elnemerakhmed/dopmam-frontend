import React from 'react';
import { Layout } from 'antd';

import Header from './Header';
import Footer from './Footer';
import Content from './Content';

const UserLayout = ({ path, css, children, copyright, year }) => {
    return (
        <Layout>
            <Header />            
            <Layout>     
                <Content path={path} css={css}>
                    {children}
                </Content> 
                <Footer copyright={copyright} year={year}/>
            </Layout>
        </Layout>
    )
};

UserLayout.defaultProps = {
    path: [],
    copyright: 'Dopmam',
    year: 2021
}

export default UserLayout;
