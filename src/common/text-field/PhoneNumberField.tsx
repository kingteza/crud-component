/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import React, { FC, useCallback, useImperativeHandle, useRef } from "react";

import flags from "react-phone-number-input/flags";
import PhoneInput, {
  isValidPhoneNumber,
  Value,
  FeatureProps,
  parsePhoneNumber,
  Country,
} from "react-phone-number-input";
import { TextFieldProps } from "./TextField";
import { Form, Input } from "antd";
import { Rule } from "antd/es/form";
import { ValidationUtil } from "src/util";
import { useTranslationLib } from "src/locale";

export type OnChangeProps = (value: Value | undefined) => void;
export type CountryCode = Country;

export interface PhoneNumberConfigProps {
  defaultCountry?: CountryCode;
}

const PhoneNumberField: FC<
  TextFieldProps & { onChange?: OnChangeProps } & FeatureProps<any>
> = ({ className, defaultCountry, ...props }) => {
  const { t } = useTranslationLib();

  const rules: Rule[] = [
    ...(props.rules ?? []),
    ...(props.required
      ? ValidationUtil.required(props.label ?? props.placeholder ?? ("" as any))
      : []),
    {
      validator: (_, value) => {
        if (!value) return Promise.resolve();
        if (!isValidPhoneNumber(value)) {
          return Promise.reject(
            new Error(
              `${t("err.validation.invalid")} ${
                props.label ?? props.placeholder ?? ""
              }`
            )
          );
        }
        return Promise.resolve();
      },
    },
  ];
  const getValueProps = useCallback((value) => {
    if (!value) return { value: undefined };

    // If value is already a string, try to parse and format it
    if (typeof value === "string") {
      try {
        const phoneNumber = parsePhoneNumber(value);
        if (phoneNumber) {
          // Format to E.164 format (+94771234567)
          const formattedPhone = phoneNumber.format("E.164");
          return { value: formattedPhone };
        }
      } catch {
        // If parsing fails, return the value as-is
        return { value };
      }
    }

    // If value is already a Value type from react-phone-number-input
    return { value: value?.toString() };
  }, []);

  const getValueFromEvent = useCallback((value: any) => {
    // Convert the phone input value to E.164 format string
    if (!value) return undefined;
    try {
      const phoneNumber = parsePhoneNumber(value);
      if (phoneNumber) {
        // Return E.164 format string (+94771234567)
        return phoneNumber.format("E.164");
      }
    } catch {
      // If parsing fails, return the value as string
      return typeof value === "string" ? value : value?.toString();
    }
    return typeof value === "string" ? value : value?.toString();
  }, []);

  return (
    <Form.Item
      {...props}
      className={className}
      rules={rules}
      getValueProps={getValueProps}
      getValueFromEvent={getValueFromEvent}
    >
      <PhoneInput0
        {...props}
        onChange={props.onChange as any}
        defaultCountry={defaultCountry}
        
      />
    </Form.Item>
  );
};

export default PhoneNumberField;

const PhoneInput0: FC<FeatureProps<any> & { onChange: OnChangeProps }> = (
  props
) => {
  return <PhoneInput {...props} flags={flags} inputComponent={MyInput} />;
};

const MyInput = React.forwardRef(({ required, ...props }: any, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return (inputRef.current as any)?.input;
    },
    []
  );
  return <Input {...props} ref={inputRef} />;
});
