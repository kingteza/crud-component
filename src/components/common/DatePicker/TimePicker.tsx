/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Form, TimePicker } from "antd";
import { FormItemProps } from "antd/lib/form";
import dayjs, { Dayjs } from "dayjs";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";

export type DateRange = [Dayjs | null, Dayjs | null];
export interface TimePickerComponentProps extends FormItemProps<any> {
  type?: any;
  onEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  nextFocus?: string;
  disableCurrent?: boolean;
  use12Hours?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  disabledPast?: boolean;
  disabledFuture?: boolean;
  renderExtraFooter?: () => React.ReactElement;
}

export interface TimeRangePickerProps extends TimePickerComponentProps {
  onChange?: (date: DateRange) => void;
  range: true;
  defaultValue?: DateRange;
  value?: DateRange;
  format?: string;
  placeholder?: [string, string];
}

export interface TimePickerProps extends TimePickerComponentProps {
  onChange?: (date: Dayjs | null) => void;
  range: false;
  defaultValue?: Dayjs;
  value?: Dayjs;
  format?: string;
  placeholder?: string;
}

const TimePickerComponent: FC<TimeRangePickerProps | TimePickerProps> = ({
  type,
  required,
  label,
  rules = [],
  placeholder,
  disabledPast = false,
  disableCurrent = false,
  onEnter,
  disabled,
  use12Hours,
  nextFocus,
  onChange,
  range,
  disabledFuture,
  defaultValue,
  value,
  format,
  autoComplete = "off",
  renderExtraFooter,
  ...props
}) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  const placeHolder0 = useMemo(
    () => (placeholder ? placeholder : range ? ["From", "To"] : "Select time"),
    [placeholder, range]
  );
  console.log(placeHolder0);
  const Component = !range ? TimePicker : TimePicker.RangePicker;

  const disabledDate = useCallback(
    (current: any | null) => {
      if (!current) {
        // In the context of the RangePicker, null represents an empty value (no selection)
        return false;
      }
      const today = dayjs();
      const con1 = disabledPast && current < today;
      const con2 = disabledFuture && current > today;
      const con3 = disableCurrent && current < today && today < current;
      return con1 || con2 || con3;
    },
    [disableCurrent, disabledFuture, disabledPast] // Dependencies for useCallback
  );

  return (
    <Form.Item
      {...props}
      label={label}
      rules={[
        {
          required,
          message: `${label ?? placeholder ?? ""} ${t(
            "err.validation.required"
          )}`,
        },
        ...rules,
      ]}
    >
      <Component
        use12Hours={use12Hours}
        renderExtraFooter={renderExtraFooter}
        value={value as any}
        defaultValue={defaultValue as any}
        format={format}
        onChange={(e) => onChange?.(e)}
        disabledDate={disabledDate}
        disabled={disabled}
        className="w-100"
        placeholder={placeHolder0 as any}
      />
    </Form.Item>
  );
};

export default TimePickerComponent;
