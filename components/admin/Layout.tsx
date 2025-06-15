'use client'

import { FC } from 'react';
import {
  CreditCardOutlined,
  LoginOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChildrenInterface from '../../interface/Children.interface';
import Logo from '../shared/logo';

const { Header, Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const AdminLayout: FC<ChildrenInterface> = ({children}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pathname = usePathname()

  const menus = [
    {
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Products</Link>,
      key: 'products'
    },
    {
      icon: <ReconciliationOutlined />,
      label: <Link href="/admin/orders">Orders</Link>,
      key: 'orders'
    },
    {
      icon: <CreditCardOutlined />,
      label: <Link href="/admin/payments">Payments</Link>,
      key: 'payments'
    },
    {
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Users</Link>,
      key: 'users'
    }
  ]

  const acountMenu = {
    items: [
      {
        icon: <ProfileOutlined />,
        label: <a>bk sarswal</a>,
        key: 'fullname'
      },
      {
        icon: <LoginOutlined />,
        label: <a>Logout</a>,
        key: 'logout'
      },
      {
        icon: <SettingOutlined />,
        label: <a>Settings</a>,
        key: 'settings'
      }
    ]
  }

  const getBreadCrumbs = (pathname: string)=>{
    const arr = pathname.split("/")
    const bread = arr.map((item)=>({
      title: item
    }))
    return bread
  }

  return (
    <Layout hasSider>
      <Sider style={siderStyle} width={250}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" items={menus} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className='flex items-center'>
          <div className='px-8 flex justify-between items-center w-full'>
            <Logo />
            <div>
              <Dropdown menu={acountMenu}>
                <Avatar 
                  size="large" 
                  src="/images/avt.avif"  
                />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} className='px-8 flex flex-col gap-8'>
          <Breadcrumb
            items={getBreadCrumbs(pathname)}
          />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout