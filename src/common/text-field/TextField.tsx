/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { LoadingOutlined } from "@ant-design/icons";
import { Form, FormItemProps, Input } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { FormInstance } from "antd/lib/form/Form";
import React, { useMemo } from "react";
import { useTranslationLib } from "../../locale";


import TooltipComponent from "../tooltip/TooltipComponent";

export interface TextFieldProps extends FormItemProps<any> {
  type?: any;
  placeholder?: string;
  onEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  form?: FormInstance<any>;
  addonAfter?: any;
  addonBefore?: any;
  nextFocus?: string;
  autoComplete?: string;
  defaultValue?: any;
  readOnly?: boolean;
  value?: any;
  autoFocus?: boolean;
  disabled?: boolean;
  size?: SizeType;
  loading?: boolean;
  inputRef?: any;
  onBlur?: any;
  onChange?: (val: any) => void;
}

export const onEnterInternalTextField = (
  e: React.KeyboardEvent<HTMLInputElement>,
  nextFocus?: string,
  form?: FormInstance<any>,
  onEnter?: React.KeyboardEventHandler<HTMLInputElement>
) => {
  if (nextFocus && form) {
    e.preventDefault();
    form?.getFieldInstance(nextFocus)?.focus();
  }
  if (onEnter) onEnter(e);
};

const TextField: React.FC<TextFieldProps> = ({
  type,
  required,
  label,
  disabled,
  rules = [],
  placeholder,
  onEnter,
  size,
  form,
  addonAfter,
  addonBefore,
  nextFocus,
  autoComplete = "off",
  defaultValue,
  readOnly,
  value,
  loading,
  onBlur,
  inputRef,
  status,
  autoFocus,
  onChange,
  tooltip,
  ...props
}) => {
  const { t } = useTranslationLib();

  const r = useMemo(() => {
    const list = [
      ...rules,
      {
        required,
        message: `${label ?? placeholder ?? ""} ${t(
          'err.validation.required'
        )}`,
      },
    ];
    if (type === "email") {
      list.push({
        type: "email",
        message: t('err.validation.invalidEmail'),
      });
    }
    return list;
  }, [rules, required, label, placeholder, t, type]);

  const inputProps = {
    disabled: disabled,
    value: value,
    readOnly: readOnly,
    defaultValue: defaultValue,
    autoFocus,
    addonBefore,
    ref: inputRef,
    onBlur,
    addonAfter: loading ? <LoadingOutlined /> : addonAfter,
    status,
    size: size,
    autoComplete: autoComplete,
    onPressEnter: (e) => onEnterInternalTextField(e, nextFocus, form, onEnter),
    type: type as any,
    placeholder: placeholder ?? (label as any),
  };
  const Component = type == "password" ? Input.Password : Input;
  return (
    <TooltipComponent title={tooltip as any}>
      <Form.Item {...props} label={label} rules={r}>
        <Component {...(inputProps as any)} />
      </Form.Item>
    </TooltipComponent>
  );
};

export default TextField;
