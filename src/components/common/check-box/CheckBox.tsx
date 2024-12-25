/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Checkbox, Switch } from 'antd';
import { Form, FormItemProps } from 'antd';
import React, { FC } from 'react';

const FormItem = Form.Item;

interface Props extends FormItemProps {
  onChange?: (evt: boolean) => void;
  disabled?: boolean;
  switch?: boolean;
}

const CheckBoxComponent: FC<Props> = ({
  onChange,
  label,
  initialValue = false,
  disabled,
  switch: asASwitch = false,
  ...props
}) => {
  return (
    <FormItem
      {...props}
      valuePropName="checked"
      initialValue={initialValue}
      label={asASwitch ? label : undefined}
    >
      {Boolean(asASwitch) && (
        <Switch
          disabled={disabled}
          defaultChecked={initialValue}
          onChange={onChange && ((e) => onChange(e))}
        ></Switch>
      )}
      {!asASwitch && (
        <Checkbox
          disabled={disabled}
          defaultChecked={initialValue}
          onChange={onChange && ((e) => onChange(e.target.checked))}
        >
          {label}
        </Checkbox>
      )}
    </FormItem>
  );
};

export default CheckBoxComponent;
