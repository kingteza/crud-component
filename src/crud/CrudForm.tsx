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
import CrudUtil from "src/util/CrudUtil";

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
}: Readonly<CurdFormFieldsProps<T> & { form: FormInstance }>) {
  return (
    <Form form={form} layout="vertical">
      <CrudFormFields {...props} purpose={purpose} />
    </Form>
  );
}

export function CrudFormFields<T>({
  fields,
  formBuilder,
  grid,
  onDeleteFile,
  onUploadFile,
  purpose,
}: Readonly<CurdFormFieldsProps<T>>) {
  const _fields = useMemo(
    () =>
      fields
        .filter((e) => !e.readonly)
        .map((e) => {
          const functionProps = {
            onUploading:
              e.type === "image" || e.type === "file"
                ? (x) => {
                    if ((e as any).onUploading) (e as any).onUploading?.(x);
                    onUploadFile?.(x);
                  }
                : undefined,
            onDelete:
              e.type === "image" || e.type === "file"
                ? (x) => {
                    if ((e as any).onUploading) (e as any).onDelete?.(x);
                    onDeleteFile?.(x);
                  }
                : undefined,
          };
          return (
            <React.Fragment key={e.name as string}>
              {e.grid && grid ? (
                <Col {...e.grid}>
                  <CrudField
                    {...e}
                    {...(functionProps as any)}
                    key={typeof e.name === "string" ? e.name : String(e.name)}
                    updatable={purpose !== "update" ? true : e.updatable}
                  />
                </Col>
              ) : (
                <CrudField
                  {...e}
                  {...(functionProps as any)}
                  key={typeof e.name === "string" ? e.name : String(e.name)}
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
      const e = fields.find((field) => CrudUtil.getRealName(field.name) === name);
      if (e?.hidden) return <></>;
      if (e) {
        const functionProps = {
          onUploading:
            e.type === "image" || e.type === "file"
              ? (x) => {
                  if ((e as any).onUploading) (e as any).onUploading?.(x);
                  onUploadFile?.(x);
                }
              : undefined,
          onDelete:
            e.type === "image" || e.type === "file"
              ? (x) => {
                  if ((e as any).onUploading) (e as any).onDelete?.(x);
                  onDeleteFile?.(x);
                }
              : undefined,
        };
        const realName = CrudUtil.getRealName(e.name);
        const component = (
          <CrudField
            {...e}
            {...options}
            {...functionProps}
            key={typeof realName === "string" ? realName : String(realName)}
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
