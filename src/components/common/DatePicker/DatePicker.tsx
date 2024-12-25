/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { DatePicker, Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

import { translations } from '../../../config/localization/translations';

export type DateRange = [Dayjs | null, Dayjs | null];
export interface DatePickerComponentProps extends FormItemProps<any> {
  type?: any;
  placeholder?: string;
  onEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  nextFocus?: string;
  disableToday?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  enabledDates?: Date[];
  disabledPastDays?: boolean;
  disabledFutureDays?: boolean;
  renderExtraFooter?: () => React.ReactElement;
}
export interface DateRangePickerProps extends DatePickerComponentProps {
  onChange?: (date: DateRange) => void;
  range: true;
  defaultValue?: DateRange | boolean;
  value?: DateRange;
  format?: string;
  picker?: string;
  showTime?: boolean;
}
export interface DatePickerProps extends DatePickerComponentProps {
  onChange?: (date: Dayjs | null) => void;
  defaultValue?: Dayjs;
  value?: Dayjs;
  range?: false;
  format?: string;
  picker?: string;
  showTime?: never;
}

const DatePickerComponent: FC<DateRangePickerProps | DatePickerProps> = ({
  type,
  required,
  label,
  rules = [],
  placeholder,
  disabledPastDays = false,
  disableToday = false,
  onEnter,
  disabled,
  nextFocus,
  onChange,
  range,
  showTime,
  disabledFutureDays,
  picker,
  defaultValue,
  value,
  format,
  autoComplete = 'off',
  enabledDates = [],
  renderExtraFooter,
  ...props
}) => {
  const { t } = useTranslation();

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return dayjs(date);
  }, []);
  const Component: any = !range ? DatePicker : DatePicker.RangePicker;

  const disabledDate = useCallback(
    (current: any | null) => {
      if (!current) {
        // In the context of the RangePicker, null represents an empty value (no selection)
        return false;
      }
      const today = dayjs();
      const con1 = disabledPastDays && current < today.startOf('day');
      const con2 = disabledFutureDays && current > today.endOf('day');
      const con3 =
        disableToday && current < today.endOf('day') && today.startOf('day') < current;
      return con1 || con2 || con3;
    },
    [disabledPastDays, disabledFutureDays, disableToday], // Dependencies for useCallback
  );

  return (
    <Form.Item
      {...props}
      label={label}
      rules={[
        {
          required,
          message: `${label ?? placeholder ?? ''} ${t(
            translations.err.validation.required,
          )}`,
        },
        ...rules,
      ]}
    >
      <Component
        renderExtraFooter={renderExtraFooter}
        value={value}
        picker={picker}
        defaultValue={defaultValue}
        format={format}
        onChange={(e) => onChange?.(e)}
        disabledDate={disabledDate}
        disabled={disabled}
        className="w-100"
        placeholder={placeholder}
        showTime={showTime}
      />
    </Form.Item>
  );
};

export default DatePickerComponent;
