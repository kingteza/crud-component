/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Layout, Tabs } from 'antd';
import { TabsPosition } from 'antd/lib/tabs';
import useWindowDimensions from 'context/WindowDimension';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;

interface TabViewWithRouteProps {
  initialKey?: string;
  positionOfRoute: number;
  className?: string;
  tabs: {
    label: React.ReactNode;
    key: string;
  }[];
  mode?: 'side' | 'default';
}

export const TabViewWithRoute: React.FC<TabViewWithRouteProps> = ({
  positionOfRoute,
  initialKey = '*',
  tabs,
  className = '',
  mode = 'default',
}) => {
  const [activeKey, setActiveKey] = useState<string>(initialKey);
  const navigate = useNavigate();

  const callback = (route: string) => {
    navigate(route);
  };

  const location = useLocation();
  useEffect(() => {
    const currentPos = location.pathname.split('/')[positionOfRoute];
    setActiveKey(currentPos ?? '');
    if (!currentPos) {
      navigate(initialKey, { replace: true });
    }
  }, [initialKey, location.pathname, navigate, positionOfRoute]);

  const { isDesktop } = useWindowDimensions();
  const isModeSide = mode === 'side' && isDesktop;
  const tabPosition: TabsPosition = (isModeSide ? 'left' : 'top');
  const cssStyles = isModeSide ? 'd-flex h-100' : '';
  return (
    <div className={`${className} ${cssStyles}`}>
      <Tabs
        type="card"
        tabPosition={tabPosition}
        activeKey={activeKey}
        onChange={callback}
      >
        {tabs.map(({ key, label }) => {
          return (
            <Tabs.TabPane key={key} tab={label}>
              {/* {activeKey === key && ()} */}
            </Tabs.TabPane>
          );
        })}
      </Tabs>

      <Content className={`max-height ${isModeSide ? 'overflow-auto' : ''}`}>
        <Outlet />
      </Content>
    </div>
  );
};
