import React from 'react'
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

const ContentComponent = ({ path, children, css }) => {
    return (
        <Content className="container">
            <Breadcrumb className="breadcrumb">
                {path.map(page => <Breadcrumb.Item key={page}>{page}</Breadcrumb.Item>)}
            </Breadcrumb>
            <div className={css}>
                {children}
            </div>
        </Content>
    );
};

ContentComponent.defaultProps = {
    path: [],
    css: ''
}

export default ContentComponent;
