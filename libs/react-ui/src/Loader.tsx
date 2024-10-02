import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 50, fontWeight: 20 }} spin />;

export const Loader: React.FC = () => <Spin indicator={antIcon} />;