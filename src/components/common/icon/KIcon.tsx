/* eslint-disable react/display-name */
/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Icon as IconifyIconComponent, IconifyIcon } from '@iconify/react';
import React, { FC, useMemo } from 'react';

const getIcon = (icon: any) => (props) => {
  return <IconifyIconComponent {...props} icon={icon} />;
};

const KIcon: FC<
  Partial<CustomIconComponentProps> &
    ({ icon: IconifyIcon | string } | { component: any })
> = ({ icon, component, ...props }: any) => {
  const finalIcon = useMemo(() => component ?? getIcon(icon), [icon, component]);

  return <Icon {...props} component={finalIcon}></Icon>;
};

export default KIcon;
