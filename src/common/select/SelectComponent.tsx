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
} from "antd";
import { RefSelectProps } from "antd/lib/select";
import { ReactElement, useCallback } from "react";
import { useTranslationLib } from "../../locale";

import TooltipComponent from "../tooltip/TooltipComponent";
import { ValidationUtil } from "src/util";

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
}: Readonly<SelectComponentProps<T>>) {
  const { t } = useTranslationLib();
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
  const label0 = label ?? placeholder ?? "";
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
          required={required}
          rules={[
            ...rules,
            ...(required ? ValidationUtil.required(label0 as string) : []),
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
            popupRender={dropdownRender}
          >
            {children === null
              ? undefined
              : children ??
                (items ? items?.map(itemBuilder ?? _itemBuilder) : <></>)}
          </Select>
        </Form.Item>
      </TooltipComponent>
    </ConfigProvider>
  );
}

export default SelectComponent;
