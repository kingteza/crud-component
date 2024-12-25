/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Typography } from 'antd';
import React, { CSSProperties, FC, useEffect } from 'react';

const { Title } = Typography;
const TitleWithHeadTitle: FC<{
  children: string | React.ReactNode;
  style?: CSSProperties;
  level?: 3 | 5 | 1 | 2 | 4 | undefined;
}> = ({ level = 3, children, style }) => {
  useEffect(() => {
    document.title = children + ' | BIZ ERP';
  }, [children]);

  return (
    <Title style={style} level={level}>
      {children}
    </Title>
  );
};

export default TitleWithHeadTitle;
