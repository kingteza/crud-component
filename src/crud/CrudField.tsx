/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import { ColorPicker, Form, Radio, Select, Tag } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslationLib, useTranslationLibNoNS } from "../locale";

import {
  CheckboxBasedFieldProps,
  ColorPickerFieldProps,
  CrudFieldProps,
  DateBasedFieldProps,
  EnumCrudField,
  InitialCrudField,
  NumberBasedFieldProps,
  SelectCrudField,
  SelectFieldItem,
  TextBasedFieldProps,
  TimeBasedFieldProps,
} from "./CrudComponent";
import FileCrudFieldComponent, { FileCrudField } from "./FileCrudField";
import ImageCrudFieldComponent, { ImageCrudField } from "./ImageCrudField";
import {
  TextField,
  NumberTextField,
  CheckBoxComponent,
  DatePickerComponent,
  TimePickerComponent,
  SelectComponent,
  TooltipComponent,
} from "../common";
import CrudTextAreaComponent from "./CrudTextAreaComponent";
import CrudUtil from "src/util/CrudUtil";
import { Color } from "antd/es/color-picker";

export default function CrudField<T = any>(
  props0: Readonly<CrudFieldProps<T>>
) {
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
    fieldHelper: help,
    formLayoutProps,
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

  const { t } = useTranslationLibNoNS();
  if (readonly || hidden) return <></>;
  if (customFormFieldRender) {
    return customFormFieldRender(form, props0 as any);
  }
  switch (type) {
    case "text":
    case "email":
    case "password": {
      // case 'object': // Show the text field even if the type is object
      const { onChange, placeholder, addonAfter, addonBefore } =
        props as TextBasedFieldProps<T>;
      return (
        <TextField
          {...formLayoutProps}
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
          addonAfter={addonAfter}
          addonBefore={addonBefore}
          help={help}
        />
      );
    }
    case "number": {
      const {
        onChange,
        placeholder,
        allowMinus,
        min,
        max,
        addonAfter,
        addonBefore,
      } = props as NumberBasedFieldProps<T>;
      return (
        <NumberTextField
          {...formLayoutProps}
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
          min={allowMinus ? null : min}
          max={max}
          addonAfter={addonAfter}
          addonBefore={addonBefore}
          name={name as any}
          label={label}
          help={help}
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
          {...formLayoutProps}
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
          help={help}
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
          {...formLayoutProps}
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
          help={help}
        />
      );
    }
    case "textarea": {
      return <CrudTextAreaComponent {...props0} />;
    }
    case "image":
      return (
        <ImageCrudFieldComponent
          {...props}
          required={required}
          name={name as never}
          label={label}
          rules={rules}
          fieldHelper={help}
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
          fieldHelper={help}
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
          help={help}
          updatable={updatable}
          readonly={readonly}
          fieldTooltip={fieldTooltip}
          fieldHelper={help}
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
        tagRender,
      } = props as EnumCrudField<T>;
      const list = Array.isArray(enumList) ? enumList : Object.keys(enumList);
      if (radio) {
        return (
          <Form.Item
            {...props}
            {...formLayoutProps}
            name={name as any}
            required={required}
            tooltip={fieldTooltip}
            rules={rules}
            label={label}
            className={["w-100", fieldClassName].join(" ")}
            help={help}
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
          {...formLayoutProps}
          tagRender={
            typeof tagRender === "function"
              ? tagRender
              : tagRender
              ? (props) => {
                  const { value, label } = props;
                  const tagProps = tagRender[value];
                  if (tagProps) {
                    return <Tag color={tagProps.color}>{label}</Tag>;
                  }
                  return <Tag>{label}</Tag>;
                }
              : undefined
          }
          onChange={onChange ? (val) => onChange(val, form) : undefined}
          className={["w-100", fieldClassName].join(" ")}
          name={name as any}
          items={list}
          required={required}
          tooltip={fieldTooltip}
          rules={rules}
          label={label}
          help={help}
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
      const { onChange, switch: asASwitch } =
        props as CheckboxBasedFieldProps<T>;
      return (
        <CheckBoxComponent
          {...formLayoutProps}
          className={fieldClassName}
          rules={rules}
          onChange={onChange ? (val) => onChange(val, form) : undefined}
          label={label}
          tooltip={fieldTooltip}
          disabled={!updatable}
          name={name as any}
          help={help}
          switch={asASwitch}
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
          fieldHelper={help}
        />
      );
    }
    default:
      return <>{`${type} Not Implemented`}</>;
  }
}

export function SelectCrudFieldComponent<T>(
  props: Readonly<SelectCrudField<T>>
) {
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
    selectOptionRender,
    formLayoutProps,
  } = props;
  const form = (props as any).form;
  const [typing, setTyping] = useState("");
  const realName = useMemo(() => CrudUtil.getRealName(name), [name]);
  const upsertFieldName = useMemo(
    () => CrudUtil.getRealName(name, "upsertFieldName"),
    [name]
  );
  const value = Form.useWatch(realName, form);

  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (onSet && first && value) {
      onSet?.(value, items, form);
      setFirst(false);
    }
  }, [first, form, items, realName, onSet, value]);

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

  const _selectOptionRender = useCallback(
    (option: SelectFieldItem) => {
      if (selectOptionRender) return selectOptionRender(option);
      return option.value;
    },
    [selectOptionRender]
  );

  return (
    <SelectComponent
      {...props}
      {...formLayoutProps}
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
      name={upsertFieldName}
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
                {_selectOptionRender(e)}
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
    formLayoutProps,
    required,
    fieldClassName,
    rules,
    fieldTooltip,
    updatable,
    label,
    name,
    fieldHelper: help,
  } = props as ColorPickerFieldProps<T>;

  return (
    <Form.Item
      {...formLayoutProps}
      label={label}
      name={name as any}
      required={required}
      rules={rules}
      tooltip={fieldTooltip}
      help={help}
      getValueFromEvent={(color: Color) => {
        if(typeof color === 'object') {
          return color.toHexString();
        }
        return color;
      }}
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
