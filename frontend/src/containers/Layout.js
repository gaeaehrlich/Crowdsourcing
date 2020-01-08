import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function handleClick(e) {
    console.log('click', e);
}


class CustomLayout extends React.Component {
    render() {
        return (
            <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
              {
                    this.props.isAuthenticated ?
                    <Menu.Item key="1" onClick={this.props.logout}>
                        <Link to="/">Logout {localStorage.getItem('username')}</Link>
                    </Menu.Item>
                    :
                    <Menu.Item key="2">
                        <Link to="/login">Login</Link>
                    </Menu.Item>
              }
          </Menu>
        </Header>
        <Layout>
            {this.props.isAuthenticated ?
                <Sider width={200} style={{background: '#fff'}}>
                    <Menu onClick={handleClick} style={{width: 200}} mode="vertical">

                        <SubMenu key="sub1" title={ <span><Icon type="user"/><span>My account</span></span> } >
                            <Menu.Item key="1">< Link to={`/history/${this.props.token}`}>History</Link></Menu.Item>
                            <Menu.Item key="2">Option 2</Menu.Item>
                            <Menu.ItemGroup title="Iteom 2">
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>

                        <SubMenu key="sub2" title={ <span><Icon type="form"/><span>Recommend</span></span>} />

                        <SubMenu key="sub4" title={ <span><Icon type="setting"/><span>Settings</span></span>} >
                            <Menu.Item key="9">Change my preferences</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                :
                null
            }
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
};

export default withRouter(connect(null, mapDispatchToProps)(CustomLayout));