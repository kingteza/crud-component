/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import { ColorPicker, Form, Radio, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";

import {
  CheckboxBasedFieldProps,
  ColorPickerFieldProps,
  CrudFieldProps,
  DateBasedFieldProps,
  EnumCrudField,
  NumberBasedFieldProps,
  SelectCrudField,
  TextAreaBasedFieldProps,
  TextBasedFieldProps,
  TimeBasedFieldProps,
} from "./CrudComponent";
import FileCrudFieldComponent, { FileCrudField } from "./FileCrudField";
import ImageCrudFieldComponent, { ImageCrudField } from "./ImageCrudField";
import TextField from "components/common/text-field/TextField";
import NumberTextField from "components/common/text-field/NumberField";
import CheckBoxComponent from "components/common/check-box/CheckBox";
import DatePickerComponent from "components/common/DatePicker/DatePicker";
import TimePickerComponent from "components/common/DatePicker/TimePicker";
import SelectComponent from "components/common/select/SelectComponent";
import TextAreaComponent from "components/common/text-field/TextArea";
import TooltipComponent from "components/common/tooltip/TooltipComponent";

export default function CrudField<T>(props0: CrudFieldProps<T>) {
  const {
    label,
    name,
    type,
    required,
    hidden,
    rules = [],
    updatable = true,
    readonly = false,
    fieldClassName,
    customFormFieldRender,
    fieldTooltip,
    ...props
  } = props0;
  const form = Form.useFormInstance();
  useEffect(() => {
    if (type === "select") {
      const {
        items = [],
        onSearch,
        searchOnType,
      } = props as SelectCrudField<T>;

      if (!items?.length && !searchOnType) {
        onSearch?.(undefined, form, props?.updatingValue);
      }
    }
  }, [form, props, type, props?.updatingValue]);

  const { t } = useTranslation();
  if (readonly || hidden) return <></>;
  if (customFormFieldRender) {
    return customFormFieldRender(form, props0);
  }
  switch (type) {
    case "text":
    case "email":
    case "password": {
      // case 'object': // Show the text field even if the type is object
      const { onChange, placeholder } = props as TextBasedFieldProps<T>;
      return (
        <TextField
          placeholder={placeholder}
          disabled={!updatable}
          rules={rules}
          required={required}
          onChange={onChange ? (val) => onChange(val, form) : undefined}
          type={type}
          name={name as any}
          tooltip={fieldTooltip}
          label={label}
          className={fieldClassName}
          autoComplete={"new-password"}
        />
      );
    }
    case "number": {
      const { onChange, placeholder, allowMinus } =
        props as NumberBasedFieldProps<T>;
      return (
        <NumberTextField
          placeholder={placeholder}
          disabled={!updatable}
          moneyField={Boolean((props as NumberBasedFieldProps<T>).formatted)}
          type={type}
          onChange={onChange ? (val) => onChange(val, form) : undefined}
          rules={rules}
          autoComplete={"false"}
          required={required}
          tooltip={fieldTooltip}
          className={fieldClassName}
          min={allowMinus ? null : undefined}
          name={name as any}
          label={label}
        />
      );
    }
    case "date": {
      const {
        range,
        disableToday,
        disabledFutureDays,
        disabledPastDays,
        onChange,
        placeholder,
        format,
      } = props as DateBasedFieldProps<T>;
      return (
        <DatePickerComponent
          placeholder={placeholder}
          required={required}
          disabled={!updatable}
          type={type}
          format={format}
          tooltip={fieldTooltip}
          range={range}
          name={name as any}
          label={label}
          onChange={
            onChange ? (val: any) => onChange(val as any, form) : undefined
          }
          className={fieldClassName}
          disableToday={disableToday}
          disabledFutureDays={disabledFutureDays}
          disabledPastDays={disabledPastDays}
        />
      );
    }
    case "time": {
      const {
        range = false,
        disableCurrent,
        disabledFuture,
        disabledPast,
        onChange,
        use12Hours,
        format,
        placeholder,
      } = props as TimeBasedFieldProps<T>;
      return (
        <TimePickerComponent
          placeholder={placeholder}
          required={required}
          format={format}
          disabled={!updatable}
          type={type}
          tooltip={fieldTooltip}
          range={range as any}
          use12Hours={use12Hours}
          name={name as any}
          label={label}
          onChange={onChange ? (val) => onChange(val, form) : undefined}
          className={fieldClassName}
          disableCurrent={disableCurrent}
          disabledFuture={disabledFuture}
          disabledPast={disabledPast}
        />
      );
    }
    case "textarea": {
      const { onChange, placeholder, rows, cols } =
        props as TextAreaBasedFieldProps<T>;
      return (
        <TextAreaComponent
          rules={rules}
          placeholder={placeholder}
          onChange={
            onChange ? (val) => onChange(val?.target?.value, form) : undefined
          }
          tooltip={fieldTooltip}
          required={required}
          disabled={!updatable}
          name={name as any}
          label={label}
          className={fieldClassName}
          rows={rows}
          cols={cols}
        />
      );
    }
    case "image":
      return (
        <ImageCrudFieldComponent
          {...props}
          required={required}
          name={name as never}
          label={label}
          rules={rules}
          fieldClassName={fieldClassName}
          onRemoved={(props as ImageCrudField<T>).onRemoved}
          onUploading={(props as ImageCrudField<T>).onUploading}
          provider={(props as ImageCrudField<T>).provider}
        />
      );
    case "file":
      return (
        <FileCrudFieldComponent
          {...props}
          required={required}
          name={name as never}
          label={label}
          rules={rules}
          fieldClassName={fieldClassName}
          onRemoved={(props as FileCrudField<T>).onRemoved}
          onUploading={(props as FileCrudField<T>).onUploading}
          provider={(props as FileCrudField<T>).provider}
        />
      );
    case "select": {
      return (
        <SelectCrudFieldComponent
          {...(props as any)}
          required={required}
          name={name as never}
          label={label}
          rules={rules}
          fieldClassName={fieldClassName}
          form={form}
          updatable={updatable}
          readonly={readonly}
          fieldTooltip={fieldTooltip}
        />
      );
    }
    case "enum": {
      const {
        enum: enumList,
        radio = false,
        translation,
        onChange,
        onSearch,
        multiple,
      } = props as EnumCrudField<T>;
      const list = Array.isArray(enumList) ? enumList : Object.keys(enumList);
      if (radio) {
        return (
          <Form.Item
            {...props}
            name={name as any}
            required={required}
            tooltip={fieldTooltip}
            rules={rules}
            label={label}
            className={["w-100", fieldClassName].join(" ")}
          >
            <Radio.Group
              {...props}
              onChange={
                onChange
                  ? (val) => onChange(val?.target?.value, form)
                  : undefined
              }
            >
              {list.map((e) => (
                <Radio disabled={!updatable} key={e} value={e}>
                  {translation ? t(translation[e]) : e}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );
      }
      return (
        <SelectComponent
          {...props}
          onChange={onChange ? (val) => onChange(val, form) : undefined}
          className={["w-100", fieldClassName].join(" ")}
          name={name as any}
          items={list}
          required={required}
          tooltip={fieldTooltip}
          rules={rules}
          label={label}
          disabled={!updatable}
          onSearch={onSearch ? (val) => onSearch(val, form) : undefined}
          allowClear
          mode={multiple ? "multiple" : undefined}
          itemBuilder={(e) => (
            <Select.Option key={e} value={e}>
              {translation ? t(translation[e]) : e}
            </Select.Option>
          )}
        />
      );
    }
    case "checkbox": {
      const { onChange } = props as CheckboxBasedFieldProps<T>;
      return (
        <CheckBoxComponent
          className={fieldClassName}
          rules={rules}
          onChange={onChange ? (val) => onChange(val, form) : undefined}
          label={label}
          tooltip={fieldTooltip}
          disabled={!updatable}
          name={name as any}
        />
      );
    }
    case "color": {
      return (
        <ColorCrudFieldComponent
          {...props}
          type="color"
          required={required}
          name={name as never}
          label={label}
          rules={rules}
          fieldClassName={fieldClassName}
          updatable={updatable}
          readonly={readonly}
          fieldTooltip={fieldTooltip}
        />
      );
    }
    default:
      return <>{`${type} Not Implemented`}</>;
  }
}

export function SelectCrudFieldComponent<T>(props: SelectCrudField<T>) {
  const {
    items = [],
    loading,
    searchOnType,
    onSearch,
    multiple,
    onChange,
    highlightSearch,
    required,
    fieldClassName,
    rules,
    fieldTooltip,
    updatable,
    label,
    name,
    tagRender,
    updatingValue,
    onSet,
    placeholder,
    allowClear = true,
  } = props;
  const form = (props as any).form;
  const [typing, setTyping] = useState("");
  const value = Form.useWatch(name, form);

  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (onSet && first && value) {
      onSet?.(value, items, form);
      setFirst(false);
    }
  }, [first, form, items, name, onSet, value]);

  useEffect(() => {
    if (value) {
      setFirst(true);
    }
  }, [value]);
  const _onSearch = useCallback(
    async (keyword) => {
      setTyping(keyword);
      if (searchOnType) onSearch?.(keyword, form, updatingValue);
    },
    [form, onSearch, searchOnType, updatingValue]
  );

  return (
    <SelectComponent
      {...props}
      maxTagCount="responsive"
      maxTagPlaceholder={(omittedValues) => {
        return (
          <TooltipComponent
            title={
              <>
                {omittedValues.map((e) => (
                  <>
                    {e.label} <br></br>
                  </>
                ))}
              </>
            }
          >
            +{omittedValues?.length}
          </TooltipComponent>
        );
      }}
      placeholder={placeholder}
      onSelect={(value) => {
        onSet?.(value?.key, items, form);
      }}
      onChange={
        onChange
          ? (val) => {
              setTyping("");
              onChange(val, form);
            }
          : undefined
      }
      mode={multiple ? "multiple" : undefined}
      className={["w-100", fieldClassName].join(" ")}
      name={name as any}
      items={items}
      required={required}
      tooltip={fieldTooltip}
      tagRender={tagRender}
      rules={rules}
      disabled={!updatable}
      label={label}
      allowClear={allowClear}
      onSearch={_onSearch}
      loading={loading}
      filterOption={
        highlightSearch
          ? (input, option) => {
              try {
                // Split the input into terms based on spaces
                const terms = input.toLowerCase().split(/\s+/);
                // Get the option's children and value as lowercase strings
                const optionText = (
                  (typeof option?.children === "string"
                    ? option?.children
                    : (option?.children as any)?.props?.textToHighlight) ?? ""
                ).toLowerCase();
                const optionValue = (
                  option?.value?.toString() ?? ""
                ).toLowerCase();
                // Check if every term matches either the optionText or optionValue
                return terms.every(
                  (term) =>
                    optionText.indexOf(term) >= 0 ||
                    optionValue.indexOf(term) >= 0
                );
              } catch (err) {
                return true;
              }
            }
          : undefined
      }
      itemBuilder={
        !highlightSearch
          ? (e) => (
              <Select.Option
                key={e.key}
                value={e.key}
                title={e.value}
                disabled={e.disabled}
              >
                {e.value}
              </Select.Option>
            )
          : (e) => {
              const value = e.value ? String(e.value) : undefined;
              return (
                <Select.Option
                  key={e.key}
                  value={e.key}
                  title={value}
                  disabled={e.disabled}
                >
                  <Highlighter
                    highlightClassName="highlight-text"
                    searchWords={(typing ?? "").split(" ")}
                    autoEscape={true}
                    textToHighlight={value ?? ""}
                  />
                </Select.Option>
              );
            }
      }
    ></SelectComponent>
  );
}

export function ColorCrudFieldComponent<T>(props: ColorPickerFieldProps<T>) {
  const {
    required,
    fieldClassName,
    rules,
    fieldTooltip,
    updatable,
    label,
    name,
  } = props as ColorPickerFieldProps<T>;

  return (
    <Form.Item
      label={label}
      name={name as any}
      required={required}
      rules={rules}
      tooltip={fieldTooltip}
    >
      <ColorPicker
        disabledAlpha
        format="hex"
        defaultFormat="hex"
        showText
        trigger="click"
        className={fieldClassName}
        disabled={!updatable}
        {...props.innerProps}
      ></ColorPicker>
    </Form.Item>
  );
}
