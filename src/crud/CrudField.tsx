/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import {
  Checkbox,
  Col,
  ColorPicker,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Select,
  Tag,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslationLib, useTranslationLibNoNS } from "../locale";

import {
  CheckboxBasedFieldProps,
  ColorPickerFieldProps,
  CrudFieldProps,
  DateBasedFieldProps,
  EnumCrudField,
  NumberBasedFieldProps,
  PhoneNumberFieldProps,
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
import CrudUtil from "../util/CrudUtil";
import { Color } from "antd/es/color-picker";
import PhoneNumberField from "../common/text-field/PhoneNumberField";
import { useCrudSearchContext } from "../context/CrudSearchContext";
import { FormInstance } from "antd/lib";

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

  const searchContext = useCrudSearchContext();
  const handleChange = useCallback((value: any, handleChangeFn?: (value: any, form: FormInstance<T>) => void) => {
    if (searchContext) {
      searchContext.search();
    }
    if (!readonly && handleChangeFn) {
      handleChangeFn(value, form);
    }
  }, [searchContext, readonly, form]);

  if (readonly || hidden) return <></>;
  if (customFormFieldRender) {
    return customFormFieldRender(form, props0 as any);
  }
  switch (type) {
    case "text":
    case "email":
    case "password": {
      // case 'object': // Show the text field even if the type is object
      const { maxLength, onChange, placeholder, addonAfter, addonBefore } =
        props as TextBasedFieldProps<T>;
      return (
        <TextField
          {...formLayoutProps}
          maxLength={maxLength}
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
    case "phone": {
      const { onChange, placeholder, addonAfter, addonBefore } =
        props as PhoneNumberFieldProps<T>;
      return (
        <PhoneNumberField
          {...props}
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
        int,
        step,
        changeOnWheel = false,
      } = props as NumberBasedFieldProps<T>;
      return (
        <NumberTextField
          {...formLayoutProps}
          step={step}
          changeOnWheel={changeOnWheel}
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
          isInt={int}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onUploadComplete={(props as ImageCrudField<T>).onUploadComplete}
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
          onUploadComplete={(props as FileCrudField<T>).onUploadComplete}
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
      return <EnumCrudFieldComponent {...props0} />;
    }
    case "checkbox": {
      const { onChange, switch: asASwitch } =
        props as CheckboxBasedFieldProps<T>;
      return (
        <CheckBoxComponent
          {...formLayoutProps}
          className={fieldClassName}
          rules={rules}
          onChange={handleChange}
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

export function EnumCrudFieldComponent<T>(props0: Readonly<EnumCrudField<T>>) {
  const form = Form.useFormInstance();
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
    searchable = false,
    ...props
  } = props0;

  const { t } = useTranslationLibNoNS();
  const {
    enum: enumList,
    translation,
    onChange,
    onSearch,
    multiple,
    tagRender,
  } = props as EnumCrudField<T>;
  const list = Array.isArray(enumList) ? enumList : Object.keys(enumList);

  const searchContext = useCrudSearchContext();
  const handleChange = useCallback(
    (value: any) => {
      if (searchContext) {
        searchContext.search();
      }
      if (!readonly && onChange) {
        onChange(value, form);
      }
    },
    [searchContext, readonly, onChange, form]
  );

  if ("radio" in props && props.radio) {
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
          onChange={(val) => handleChange(val?.target?.value)}
        >
          {list.map((e) => (
            <Radio disabled={!updatable} key={e} value={e}>
              {translation ? t(translation[e]) : e}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  } else if ("checkbox" in props && props.checkbox) {
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
        <Checkbox.Group className="w-100" onChange={handleChange}>
          {list.map((e) => {
            const checkbox = (
              <Checkbox disabled={!updatable} key={e} value={e}>
                {translation ? t(translation[e]) : e}
              </Checkbox>
            );
            return "checkboxGrid" in props && props.checkboxGrid ? (
              <Col {...props.checkboxGrid}>{checkbox}</Col>
            ) : (
              checkbox
            );
          })}
        </Checkbox.Group>
      </Form.Item>
    );
  }

  return (
    <SelectComponent
      {...props}
      {...formLayoutProps}
      notSearch={!searchable}
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
      onChange={handleChange}
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
      showLoadingInEmptyIndicator
      itemBuilder={(e) => (
        <Select.Option key={e} value={e}>
          {translation ? t(translation[e]) : e}
        </Select.Option>
      )}
    />
  );
}

function sameSelection(left: unknown, right: unknown) {
  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((item, index) => item === right[index])
    );
  }
  return left === right;
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
    modal = false,
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
    searchable = true,
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
  const searchContext = useCrudSearchContext();
  const handleChange = useCallback(
    (value: any) => {
      if (searchContext) {
        searchContext.search();
      }
      if (onChange) {
        setTyping("");
        onChange(value, form);
      }
    },
    [searchContext, onChange, form]
  );

  const { t } = useTranslationLibNoNS();
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [beforeValue, setBeforeValue] = useState<any>(undefined);
  const [keyword, setKeyword] = useState("");

  const onClickOpen = useCallback(() => {
    setBeforeValue(form?.getFieldValue(upsertFieldName));
    setKeyword("");
    setOptionModalOpen(true);
  }, [form, upsertFieldName]);

  const onCancel = useCallback(() => {
    setOptionModalOpen(false);
    setKeyword("");
    form?.setFieldValue(
      upsertFieldName,
      beforeValue === undefined ? null : beforeValue
    );
  }, [beforeValue, form, upsertFieldName]);

  const onOk = useCallback(() => {
    const next = form?.getFieldValue(upsertFieldName);
    setOptionModalOpen(false);
    setKeyword("");
    setBeforeValue(undefined);
    if (!sameSelection(next, beforeValue)) {
      handleChange(next);
      onSet?.(next, items, form);
    }
  }, [beforeValue, form, handleChange, items, onSet, upsertFieldName]);

  const onSelectOpenChange = useCallback(
    (visible: boolean) => {
      if (modal && visible && updatable !== false) {
        onClickOpen();
      }
    },
    [modal, onClickOpen, updatable]
  );

  const onKeywordChange = useCallback(
    (text: string) => {
      setKeyword(text);
      if (searchOnType) _onSearch(text);
    },
    [_onSearch, searchOnType]
  );

  const visibleItems = useMemo(() => {
    if (searchOnType) return items;
    const terms = keyword.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items;
    return items.filter((item) => {
      const raw = String(item.value ?? "").toLowerCase();
      const compact = raw.replace(/\s/g, "");
      const key = String(item.key ?? "").toLowerCase();
      return terms.every(
        (term) =>
          raw.includes(term) ||
          key.includes(term) ||
          compact.includes(term.replace(/\s/g, ""))
      );
    });
  }, [items, keyword, searchOnType]);

  const selectFieldProps = { ...props };
  delete selectFieldProps.modal;

  return (
    <>
      {modal && (
        <Modal
          open={optionModalOpen}
          onCancel={onCancel}
          onOk={onOk}
          destroyOnHidden
          title={label}
        >
          {searchable && (
            <Input
              allowClear
              className="mb-2"
              placeholder={placeholder ?? t("str.search")}
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
            />
          )}
          <Form.Item name={upsertFieldName as any} noStyle>
            {multiple ? (
              <Checkbox.Group disabled={!updatable} style={{ width: "100%" }}>
                <List
                  size="small"
                  loading={loading}
                  style={{ maxHeight: 360, overflow: "auto", width: "100%" }}
                  dataSource={visibleItems}
                  renderItem={(item, index) => (
                    <List.Item
                      key={item.key ?? index}
                      style={{ width: "100%" }}
                    >
                      <Checkbox value={item.key} disabled={item.disabled}>
                        {_selectOptionRender(item)}
                      </Checkbox>
                    </List.Item>
                  )}
                />
              </Checkbox.Group>
            ) : (
              <Radio.Group disabled={!updatable} style={{ width: "100%" }}>
                <List
                  size="small"
                  loading={loading}
                  style={{ maxHeight: 360, overflow: "auto", width: "100%" }}
                  dataSource={visibleItems}
                  renderItem={(item, index) => (
                    <List.Item
                      key={item.key ?? index}
                      style={{ width: "100%" }}
                    >
                      <Radio value={item.key} disabled={item.disabled}>
                        {_selectOptionRender(item)}
                      </Radio>
                    </List.Item>
                  )}
                />
              </Radio.Group>
            )}
          </Form.Item>
        </Modal>
      )}
    <SelectComponent
      {...selectFieldProps}
      {...formLayoutProps}
      showLoadingInEmptyIndicator
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
      notSearch={modal || !searchable}
      open={modal ? false : undefined}
      onOpenChange={modal ? onSelectOpenChange : undefined}
      placeholder={placeholder}
      onSelect={(value) => {
        onSet?.(value?.key, items, form);
      }}
      onChange={handleChange}
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
    </>
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
        if (typeof color === "object") {
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
