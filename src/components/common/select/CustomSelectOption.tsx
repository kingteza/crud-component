/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import {List } from 'antd';
import React, { FC, PropsWithChildren } from 'react';

const Meta = List.Item.Meta;
const Item = List.Item;

type CustomSelectOptionProps = {
  title: string;
  description?: string;
};

const CustomSelectOption: FC<PropsWithChildren<CustomSelectOptionProps>> = ({
  title,
  description,
  children,
}) => {
  return (
    <Item className="">
      <div>
        <Meta title={title} description={description} />
      </div>
      <div className="float-right">{children}</div>
    </Item>
  );
};

export default CustomSelectOption;
