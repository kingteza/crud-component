/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { FC } from 'react';

import ValidationUtil from '../../../util/ValidationUtil';
import TextField, { TextFieldProps } from './TextField';

const PhoneNumberField: FC<TextFieldProps> = (props) => {
  return (
    <TextField
      {...props}
      rules={[
        ...(props.rules ?? []),
        ...ValidationUtil.phoneValidation(
          (props.label ?? props.placeholder ?? '') as any,
        ),
      ]}
    />
  );
};

export default PhoneNumberField;
