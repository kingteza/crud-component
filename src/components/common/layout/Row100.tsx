/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Col, Row } from 'antd';
import React, { FC, ReactElement } from 'react';

const Row100: FC<{ children?: React.ReactNode; key?: string }> = ({ children, key }) => {
  const definedChildCount = React.Children.toArray(children).filter(Boolean);
  let span = 0;
  switch (definedChildCount.length) {
    case 1:
      span = 24;
      break;
    case 2:
      span = 12;
      break;
    case 3:
      span = 8;
      break;
    case 4:
      span = 6;
      break;
    case 5:
      span = 6;
      break;
    case 6:
      span = 4;
      break;
    case 8:
      span = 8;
      break;
    case 12:
      span = 1;
      break;
  }
  return (
    <Row gutter={[8, 8]}>
      {definedChildCount?.map((child, index) => (
        <Col key={`${key}${index}`} span={span}>
          {child}
        </Col>
      ))}
    </Row>
  );
};

export default Row100;
