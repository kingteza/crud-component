/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Tooltip } from 'antd';
import React, { FC, PropsWithChildren, ReactElement } from 'react';

const TooltipComponent: FC<PropsWithChildren<{ title?: ReactElement }>> = ({
  children,
  title,
}) => {
  if (title) return <Tooltip title={title}>{children}</Tooltip>;
  return children;
};

export default TooltipComponent;
