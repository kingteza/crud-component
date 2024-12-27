/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Descriptions } from 'antd';
import { DescriptionsProps } from 'antd/lib/descriptions';
import React, { FC, useMemo } from 'react';

import NumberUtil from '../../util/NumberUtil';

export type DescPropsNullable = {
  label?: string | React.ReactElement;
  value?: any;
  noFormatting?: boolean;
};

export type DescProps = { label?: string; value: any; noFormatting?: boolean };
export interface DescListProps extends DescriptionsProps {
  list: (DescPropsNullable | null | undefined | boolean)[];
  keepEmptyValues?: boolean;
}

const DescriptionItem = Descriptions.Item;

const DescList: FC<DescListProps> = ({ list, keepEmptyValues, ...props }) => {
  const listCus = useMemo(() => {
    const l: DescProps[] = keepEmptyValues ? list : (list as any).filter((v: any) => v && Boolean(v.value));
    l.forEach((v) => {
      if (!v.noFormatting && !isNaN(v.value)) v.value = NumberUtil.toMoney(v.value);
    });
    return l;
  }, [keepEmptyValues, list]);

  return (
    <Descriptions {...props}>
      {listCus.map(({ label, value }) => (
        <DescriptionItem key={label} label={label}>
          {value}
        </DescriptionItem>
      ))}
    </Descriptions>
  );
};

export default DescList;
