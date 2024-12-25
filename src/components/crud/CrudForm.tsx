/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Col, Form, FormInstance, Input, Row } from "antd";
import React, { useCallback, useMemo } from "react";

import {
  CrudFieldProps,
  CrudPurpose,
  FormBuilderFunc,
  GetFormFieldOptions,
} from "./CrudComponent";
import CrudField from "./CrudField";
import { FileCrudField } from "./FileCrudField";

export interface CurdFormFieldsProps<T> {
  onDeleteFile?: (e) => void;
  onUploadFile?: (e) => void;
  grid?: boolean;
  formBuilder?: FormBuilderFunc<T>;
  fields: CrudFieldProps<T>[];
  purpose?: CrudPurpose;
}

export function CrudForm<T>({
  form,
  purpose = "new",
  ...props
}: CurdFormFieldsProps<T> & { form: FormInstance }) {
  return (
    <>
      <Form form={form} layout="vertical">
        <CrudFormFields {...props} purpose={purpose} />
      </Form>
    </>
  );
}

export function CrudFormFields<T>({
  fields,
  formBuilder,
  grid,
  onDeleteFile,
  onUploadFile,
  purpose,
}: CurdFormFieldsProps<T>) {
  const _fields = useMemo(
    () =>
      fields
        .filter((e) => !e.readonly)
        .map((e) => {
          const functionProps: {
            onUploading: (x: File) => void;
            onDelete: (x: File | string) => void;
          } = {
            onUploading: (x) => {
              if ((e as FileCrudField<T>).onUploading)
                (e as any).onUploading?.(x);
              onUploadFile?.(x);
            },
            onDelete: (x) => {
              if ((e as FileCrudField<T>).onUploading) (e as any).onDelete?.(x);
              onDeleteFile?.(x);
            },
          };
          return (
            <React.Fragment key={e.name as string}>
              {e.grid && grid ? (
                <Col {...e.grid}>
                  <CrudField
                    {...e}
                    {...(functionProps as any)}
                    key={typeof e.name === 'string' ? e.name : String(e.name)}
                    updatable={purpose !== "update" ? true : e.updatable}
                  />
                </Col>
              ) : (
                <CrudField
                  {...e}
                  {...(functionProps as any)}
                  key={typeof e.name === 'string' ? e.name : String(e.name)}
                  updatable={purpose !== "update" ? true : e.updatable}
                />
              )}
            </React.Fragment>
          );
        }),
    [fields, grid, onDeleteFile, onUploadFile, purpose]
  );

  const getFormField = useCallback(
    (name: keyof T | string, options: GetFormFieldOptions = {}) => {
      const e = fields.find((field) => field.name === name);
      if (e?.hidden) return <></>;
      if (e) {
        const component = (
          <CrudField
            {...e}
            {...options}
            key={typeof e.name === 'string' ? e.name : String(e.name)}
            updatable={purpose !== "update" ? true : e.updatable}
          />
        );
        if (options.render) {
          return options.render(component);
        }
        return component;
      }
      return <></>;
    },
    [fields, purpose]
  );

  return (
    <>
      {formBuilder ? (
        <>
          {formBuilder(getFormField, {
            isAnyFieldHidden(...name) {
              const ar = Array.isArray(name) ? name : [name];
              const field = fields.filter((e) => ar.includes(e.name as any));
              return field.some((e) => e.hidden);
            },
            isAllFieldsHidden(...name) {
              const ar = Array.isArray(name) ? name : [name];
              const field = fields.filter((e) => ar.includes(e.name as any));
              return field.every((e) => e.hidden);
            },
          })}
          <Form.Item hidden noStyle>
            <Input name={"id"} />
            <Input />
          </Form.Item>
        </>
      ) : grid ? (
        <Row gutter={[8, 8]}>{_fields}</Row>
      ) : (
        _fields
      )}
    </>
  );
}
