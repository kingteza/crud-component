/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { SearchOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import { ColProps } from "antd/lib";
import { useCallback, useEffect, useMemo } from "react";

import { CrudFieldProps } from "./CrudComponent";
import CrudField from "./CrudField";
import { ButtonComponent } from "../common";

export type CrudSearchOption<T> = { required?: boolean } & (
  | { type: "text"; name: keyof T }
  | { type: "select"; name: keyof T; multiple?: boolean }
);

export interface CrudSearchComponentProps<T, FormType> {
  searchFields?: Array<keyof T | CrudSearchOption<T>>;
  fields: CrudFieldProps<T>[];
  searchOnChange?: boolean;
  searchDefaultValues?: FormType;
  onSearch?: (values: Partial<FormType>) => void;
  searchFieldsCustomColumnProps?: ColProps[];
}

export default function CrudSearchComponent<T, FormType>({
  searchFields = [],
  fields,
  searchOnChange,
  onSearch,
  searchDefaultValues,
  searchFieldsCustomColumnProps,
}: Readonly<CrudSearchComponentProps<T, FormType>>) {
  const showingFields: CrudFieldProps<T>[] = useMemo(
    () =>
      searchFields
        .map((field) => {
          if (typeof field === "string") {
            const field0 = fields.find((e) => field === e.name);
            return {
              ...field0,
              required: false,
            };
          }
          const f = fields.find(
            (e) => (field as CrudSearchOption<T>)?.name === e.name
          );
          return {
            ...f,
            ...(field as any),
          };
        })
        .filter((e) => e && !e?.hidden),
    [searchFields, fields]
  );
  const md = useMemo(
    () =>
      searchFields.length === 1
        ? { field: 22, button: 2 }
        : searchFields.length === 2
        ? { field: 11, button: 2 }
        : searchFields.length === 3
        ? { field: 6, button: 6 }
        : searchFields.length === 4
        ? { field: 5, button: 4 }
        : searchFields.length === 5
        ? { field: 4, button: 4 }
        : { field: 4, button: 4 },
    [searchFields.length]
  );

  const sm = useMemo(
    () =>
      searchFields.length === 1
        ? { field: 22, button: 2 }
        : searchFields.length === 2
        ? { field: 11, button: 2 }
        : searchFields.length === 3
        ? { field: 6, button: 6 }
        : searchFields.length === 4
        ? { field: 5, button: 4 }
        : searchFields.length === 5
        ? { field: 4, button: 4 }
        : { field: 4, button: 4 },
    [searchFields.length]
  );

  const xs = useMemo(
    () =>
      searchFields.length === 1
        ? { field: 21, button: 3 }
        : searchFields.length === 2
        ? { field: 11, button: 2 }
        : searchFields.length === 3
        ? { field: 24, button: 24 }
        : searchFields.length === 4
        ? { field: 5, button: 4 }
        : searchFields.length === 5
        ? { field: 4, button: 4 }
        : { field: 4, button: 4 },
    [searchFields.length]
  );
  const [form] = Form.useForm();
  const search = useCallback(
    async (ignore) => {
      if (ignore || searchOnChange) {
        if (onSearch) {
          const fields = await form.validateFields();
          onSearch(fields);
        }
      }
    },
    [form, onSearch, searchOnChange]
  );

  useEffect(() => {
    if (searchDefaultValues) {
      form.setFieldsValue(searchDefaultValues);
      search(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, searchDefaultValues]);

  if (!searchFields?.length) return <></>;

  return (
    <Form
      form={form}
      onFinish={() => search(true)}
      layout="vertical"
      className="mb-2"
      onChange={() => search(false)}
    >
      <Row gutter={[4, 8]} className="w-100">
        {showingFields.map((field, i) => {
          const props = searchFieldsCustomColumnProps?.[i] ?? {
            md: md.field,
            sm: sm.field,
            xs: xs.field,
          };
          return (
            <Col
              {...props}
              key={`search_field_${String(field.name)}`}
              className="align-self-end"
            >
              <CrudField {...field} readonly={false} fieldClassName="mb-0" />
            </Col>
          );
        })}

        <Col
          md={md.button}
          sm={sm.button}
          xs={xs.button}
          style={{ alignSelf: "end" }}
        >
          <ButtonComponent
            type="primary"
            htmlType="submit"
            block
            icon={<SearchOutlined />}
          ></ButtonComponent>
        </Col>
      </Row>
    </Form>
  );
}
