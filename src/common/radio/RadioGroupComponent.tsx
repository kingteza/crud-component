/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Form, FormItemProps, Radio } from 'antd';
import { FC, memo, useMemo } from 'react';

interface GeneralProps extends FormItemProps {
  values: { key: string | number | undefined; value: string | number }[];
}

interface EnumProps extends FormItemProps {
  enum: string[];
  translations?: any;
}

type Props = (GeneralProps | EnumProps) & {
  onChange?: (evt: boolean) => void;
  disabled?: boolean;
  button?: boolean;
};

const RadioGroupComponent: FC<Props> = ({ button, disabled, ...props }) => {
  const _values = useMemo(() => {
    const { enum: enumValues, translations } = props as EnumProps;
    if (enumValues) {
      const values: any = [];
      for (const enumValue of enumValues) {
        values.push({ key: enumValue, value: translations?.[enumValue] ?? enumValue.toUpperCase() });
      }
      return values;
    } else {
      return (props as GeneralProps).values;
    }
  }, [props]);
  const Component = button ? Radio.Button : Radio;
  return (
    <Form.Item {...props}>
      <Radio.Group disabled={disabled}>
        {_values.map(({ key, value }) => (
          <Component key={key} value={key}>
            {value}
          </Component>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default memo(RadioGroupComponent);
