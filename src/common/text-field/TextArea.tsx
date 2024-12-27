/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Form, FormInstance, FormItemProps, Input } from "antd";
import { TextAreaProps } from "antd/lib/input";
import { InputHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";

export interface TextFieldProps extends TextAreaProps, FormItemProps<any> {
  type?: InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
  status?: any;
  onEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  form?: any;
  nextFocus?: string;
  children?: any;
  name?: any;
  onReset?: any;
}

export const onEnterInternalTextField = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  nextFocus?: string,
  form?: FormInstance<any>,
  onEnter?: React.KeyboardEventHandler<HTMLInputElement>
) => {
  if (nextFocus && form) {
    e.preventDefault();
    form?.getFieldInstance(nextFocus)?.focus();
  }
  if (onEnter) onEnter(e as any);
};

const TextAreaComponent: React.FC<TextFieldProps> = ({
  required,
  label,
  rules = [],
  placeholder,
  onEnter,
  nextFocus,
  className,
  ...props
}) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const form = Form.useFormInstance();
  return (
    <Form.Item
      {...props}
      className={className}
      label={label}
      rules={[
        ...rules,
        {
          required,
          message: `${label} ${t('err.validation.required')}`,
        },
      ]}
    >
      <Input.TextArea
        {...props}
        className={className}
        onPressEnter={(e) =>
          onEnterInternalTextField(e, nextFocus, form, onEnter)
        }
        placeholder={placeholder ?? (label as any)}
      />
    </Form.Item>
  );
};

export default TextAreaComponent;
