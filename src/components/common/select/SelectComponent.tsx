/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import {
  ConfigProvider,
  Form,
  FormItemProps,
  Select,
  SelectProps,
  Spin,
  Tooltip,
} from "antd";
import { RefSelectProps } from "antd/lib/select";
import React, { ReactElement, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";

import TooltipComponent from "../tooltip/TooltipComponent";

export type SelectTagRenderProps = SelectProps["tagRender"];

// eslint-disable-next-line no-unused-vars
interface SelectComponentProps<T> extends SelectProps<any>, FormItemProps<any> {
  children?: any[] | null;
  required?: boolean;
  notSearch?: boolean;
  readOnly?: boolean;
  status?: any;
  nameFieldInArray?: string;
  items?: T[];
  showLoadingInEmptyIndicator?: boolean;
  itemBuilder?: (t: T) => ReactElement;
  dropdownRender?: (menu: ReactElement) => ReactElement;
  innerRef?: React.Ref<RefSelectProps>;
  filterOption?: SelectProps["filterOption"];
  tagRender?: SelectTagRenderProps;
}

function SelectComponent<T = any>({
  label,
  rules = [],
  required,
  placeholder,
  notSearch,
  children,
  readOnly,
  items,
  dropdownRender,
  itemBuilder,
  loading,
  showLoadingInEmptyIndicator,
  nameFieldInArray = "name",
  innerRef,
  tooltip,
  filterOption,
  tagRender,
  ...props
}: SelectComponentProps<T>) {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const _itemBuilder = useCallback(
    (value) => {
      const key =
        typeof value === "string" || typeof value === "number"
          ? value
          : value?.id;
      const val =
        typeof value === "string" || typeof value === "number"
          ? value
          : value?.[nameFieldInArray];
      return (
        <option key={key} value={key}>
          <div dangerouslySetInnerHTML={{ __html: val }} />
        </option>
      );
    },
    [nameFieldInArray]
  );
  return (
    <ConfigProvider
      renderEmpty={
        showLoadingInEmptyIndicator && loading ? () => <Spin /> : undefined
      }
    >
      <TooltipComponent title={tooltip as any}>
        <Form.Item
          label={label}
          name={props.name}
          help={props.help}
          className={props.className}
          rules={[
            ...rules,
            {
              required,
              message: `${label ?? placeholder ?? ""} ${t(
                "err.validation.required"
              )}`,
            },
          ]}
        >
          <Select
            ref={innerRef}
            loading={loading}
            open={readOnly ? false : undefined}
            onChange={(!readOnly && props.onChange) as any}
            allowClear={!readOnly && props.allowClear}
            showSearch={!notSearch}
            className={`max-width ${readOnly ? "readOnly" : ""}`}
            {...props}
            tagRender={tagRender}
            placeholder={placeholder ?? (label as any)}
            filterOption={
              filterOption ??
              ((input, option) => {
                try {
                  const opFromDiv = (option?.children as any)?.props
                    ?.dangerouslySetInnerHTML?.__html;

                  // Split the input into terms based on spaces
                  const terms = input.toLowerCase().split(/\s+/);

                  // Get the option's children and value as lowercase strings
                  const text = (option?.children as any as string) ?? "";
                  const optionText =
                    typeof text === "string"
                      ? text.toLowerCase()
                      : typeof opFromDiv === "string"
                      ? opFromDiv.toLowerCase()
                      : "";
                  const optionValue = (
                    option?.value?.toString() ?? ""
                  ).toLowerCase();
                  // Check if every term matches either the optionText or optionValue
                  const optionWithoutSpaces = optionText.replace(/\s/g, "");
                  return terms.every(
                    (term) =>
                      optionText.indexOf(term) >= 0 ||
                      optionValue.indexOf(term) >= 0 ||
                      optionWithoutSpaces.indexOf(term) >= 0
                  );
                } catch (err) {
                  console.log(err);
                  // In case of any error, default to showing the option
                  return true;
                }
              })
            }
            dropdownRender={dropdownRender}
          >
            {children === null
              ? undefined
              : children ?? (items && items?.map(itemBuilder ?? _itemBuilder))}
          </Select>
        </Form.Item>
      </TooltipComponent>
    </ConfigProvider>
  );
}

export default SelectComponent;
