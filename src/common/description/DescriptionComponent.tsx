/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Divider } from 'antd';
import { FC } from 'react';

interface DescriptionComponentProps {
  title: string;
  description: string;
}

const DescriptionComponent: FC<DescriptionComponentProps> = ({ description, title }) => {
  return (
    <>
      <Divider orientation="left" orientationMargin={0}>
        {title}
      </Divider>
      <p>{description}</p>
      <br />
    </>
  );
};

export default DescriptionComponent;
