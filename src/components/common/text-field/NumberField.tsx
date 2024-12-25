/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Form, InputNumber, Tooltip } from 'antd';
import React, { forwardRef, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../config/localization/translations';
import TooltipComponent from '../tooltip/TooltipComponent';
import { onEnterInternalTextField, TextFieldProps } from './TextField';

interface NumberTextFieldProps extends TextFieldProps {
  moneyField?: boolean;
  addonAfter?: ReactNode;
  minLength?: number;
  isInt?: boolean;
  max?: number;
  pattern?: string;
  min?: number | null;
}

function isNumeric(str: any) {
  if (typeof str !== 'string') return false; // we only process strings!
  return (
    !Number.isNaN(str) && !Number.isNaN(parseFloat(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
  ); // ...and ensure strings of whitespace fail
}

const NumberTextField = forwardRef<HTMLInputElement, NumberTextFieldProps>(function Input(
  {
    // eslint-disable-next-line no-unused-vars
    type,
    required,
    label,
    rules = [],
    placeholder,
    onEnter,
    form,
    nextFocus,
    min,
    moneyField,
    addonAfter,
    minLength,
    defaultValue,
    pattern,
    disabled,
    readOnly,
    onChange,
    value,
    max,
    addonBefore,
    size,
    isInt = false,
    tooltip,
    ...props
  },
  ref,
) {
  const { t } = useTranslation();

  const r = useMemo(
    () => [
      ...rules,
      {
        required,
        message: `${label ?? placeholder ?? ''} ${t(
          translations.err.validation.required,
        )}`,
      },
    ],
    [rules, label, placeholder, t, required],
  );

  return (
    <TooltipComponent title={tooltip as any}>
      <Form.Item {...props} label={label} rules={r}>
        <InputNumber
          ref={ref}
          disabled={disabled}
          defaultValue={defaultValue}
          value={value}
          readOnly={readOnly}
          addonBefore={addonBefore}
          minLength={minLength}
          addonAfter={addonAfter}
          step={isInt ? 1 : undefined}
          pattern={isInt ? 'd*' : pattern}
          onChange={onChange}
          onPressEnter={(e) => onEnterInternalTextField(e, nextFocus, form, onEnter)}
          className="max-width"
          min={min === null ? undefined : min ?? 0}
          max={max}
          type={moneyField ? undefined : 'number'}
          size={size}
          formatter={
            moneyField
              ? (value) => {
                  if (value.includes('.')) {
                    const parts = `${value}`.split('.');
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    return parts.join('.');
                  } else {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }
                }
              : undefined
          }
          parser={moneyField ? (value) => value?.replace(/\$\s?|(,*)/g, '') : undefined}
          placeholder={placeholder ?? (label as any)}
        />
      </Form.Item>
    </TooltipComponent>
  );
});

export default NumberTextField;
