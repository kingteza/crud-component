/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { LeftOutlined, RightOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Row } from "antd";
import { useEffect, useMemo } from "react";
import { useTranslationLib } from "../locale";

import { CrudFieldProps, CrudPurpose, CrudWizardProp } from "./CrudComponent";
import { CrudFormFields } from "./CrudForm";
import { ButtonComponent, WizardViewForm } from "../common";
import CrudUtil from "src/util/CrudUtil";

export interface CrudFormWizardProps<T> {
  onDeleteFile?: (e) => void;
  onUploadFile?: (e) => void;
  fields: CrudFieldProps<T>[];
  purpose?: CrudPurpose;
  wizard?: CrudWizardProp<T>[];
  className?: string;
  onSave: (e: T) => void;
  updatingValue?: T;
  submitting?: boolean;
}

function CrudFormWizard<T>({
  fields,
  className,
  onDeleteFile,
  onUploadFile,
  purpose,
  wizard = [],
  updatingValue,
  onSave,
  submitting,
}: Readonly<CrudFormWizardProps<T>>) {
  const wizard0 = useMemo(() => {
    return wizard.map((e) => {
      let hidden = true;
      const fieldThatShouldShowing = fields.filter((x) =>
        e.fields.includes(CrudUtil.getRealName(x.name))
      );
      fieldThatShouldShowing.forEach((x) => (hidden &&= x.hidden ?? false));
      return {
        ...e,
        hidden,
        fieldThatShouldShowing,
      };
    });
  }, [fields, wizard]);
  const filteredWizard = useMemo(
    () => wizard0.filter((e) => !e.hidden),
    [wizard0]
  );
  return (
    <WizardViewForm
      onSubmit={(_, c) => {
        onSave(c);
      }}
      className={className}
      pages={filteredWizard.map(
        ({ title, icon, fieldThatShouldShowing, hidden }, i) => ({
          title,
          icon,
          hidden,
          component: (props) => {
            return (
              <SubForm<T>
                fields={fieldThatShouldShowing}
                onDeleteFile={onDeleteFile}
                onUploadFile={onUploadFile}
                purpose={purpose}
                key={i}
                i={i}
                updatingValue={updatingValue}
                backward={props.backward}
                forward={props.forward}
                wizard={filteredWizard}
                submitting={submitting}
              />
            );
          },
        })
      )}
    />
  );
}

export default CrudFormWizard;

function SubForm<T>({
  fields,
  onDeleteFile,
  onUploadFile,
  purpose,
  wizard = [],
  i,
  forward,
  backward,
  submitting,
  updatingValue,
}: Omit<CrudFormWizardProps<T>, "form" | "onSave"> & {
  i: number;
  forward: (
    value?: any,
    submit?: boolean | undefined,
    isRetry?: boolean | undefined
  ) => void;
  backward: () => void;
}) {
  const thisWizard = wizard[i];
  //   const fields0 = fields.filter((e) => thisWizard.fields.includes(e.name));
  const { t } = useTranslationLib();
  const [form] = Form.useForm();

  useEffect(() => {
    if (updatingValue && (purpose === "update" || purpose === "clone")) {
      const obj = {};
      for (const key of fields) {
        obj[CrudUtil.getRealName(key.name, "upsertFieldName")] =
          updatingValue[CrudUtil.getRealName(key.name, "upsertFieldName")];
      }
      form.setFieldsValue(obj);
    } else if (!updatingValue) {
      //   form.resetFields();
    }
  }, [fields, form, purpose, updatingValue]);

  return (
    <Form name={String(i)} form={form} layout="vertical">
      <CrudFormFields
        fields={fields as any}
        formBuilder={thisWizard.formBuilder}
        grid={thisWizard.grid}
        onDeleteFile={onDeleteFile}
        onUploadFile={onUploadFile}
        purpose={purpose}
      />
      <Divider />
      <Row gutter={[8, 8]}>
        {i > 0 && (
          <Col md={12}>
            <ButtonComponent
              block
              icon={<LeftOutlined />}
              htmlType="button"
              type="default"
              size="large"
              onClick={() => backward()}
            >
              {t("str.back")}
            </ButtonComponent>
          </Col>
        )}
        <Col md={i > 0 ? 12 : 24}>
          <ButtonComponent
            block
            icon={
              wizard.length - 1 === i ? <SaveOutlined /> : <RightOutlined />
            }
            htmlType="submit"
            type="primary"
            loading={submitting}
            size="large"
            onClick={() => {
              form.validateFields().then((values) => {
                forward(
                  values,
                  wizard.length - 1 === i,
                  wizard.length - 1 === i
                );
              });
            }}
          >
            {wizard.length - 1 === i
              ? t("str." + (purpose === "update" ? "update" : "save"))
              : t("str.next")}
          </ButtonComponent>
        </Col>
      </Row>
    </Form>
  );
}
