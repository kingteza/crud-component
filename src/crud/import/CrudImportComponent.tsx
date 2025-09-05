/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { DownloadOutlined, WarningTwoTone } from "@ant-design/icons";
import Papa from "papaparse";
import { App, Modal, Progress, Space, Spin, Tooltip } from "antd";
import { saveAs } from "file-saver";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslationLib } from "../../locale";


import { CrudFieldProps } from "../CrudComponent";
import CrudViewer from "../view/CrudViewer";
import { DialogProps } from "../../types/DialogComponentProp";
import DateUtil from "../../util/DateUtil";
import { ButtonComponent, ImportButton } from "../../common";

export interface CrudImportComponentProps<T> {
  fields: CrudFieldProps<T>[];
  importProps: CrudImportProps<T>;
}

export interface CrudImportProps<T> {
  name: string;
  onClickImport: (
    data: Array<T | any>,
    progressCallback: (progress: number) => void
  ) => Promise<{ importJobId: string }>;
}

function CrudImportComponent<T>({
  onCloseMethod,
  open,
  fields,
  importProps,
}: DialogProps<never, boolean> & CrudImportComponentProps<T>) {
  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setData([]);
      setLoading(false);
    }
  }, [open]);
  const fieldsAvailable = useMemo(
    () =>
      new Map(
        fields
          .filter((e) => !e.hidden && !e.importProps?.hidden && !e.readonly)
          .map((e) => [e.name, e])
      ),
    [fields]
  );
  const columnNames = useMemo(
    () =>
      Array.from(fieldsAvailable.values()).flatMap((e) => [
        e.name,
        ...(e.importProps?.extraFields ?? []),
      ]),
    [fieldsAvailable]
  );

  const onClickDownloadTemplate = useCallback(
    async function () {
      const csvContent = `${columnNames.join(",")}\n`;

      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Use FileSaver to save the file
      saveAs(
        blob,
        importProps?.name +
          " - " +
          DateUtil.formatDateTimeWithSecond(new Date()).replaceAll(":", "-") +
          ".csv"
      );
    },
    [columnNames, importProps?.name]
  );

  const { t } = useTranslationLib();

  const onClickImport = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onerror = console.error;
    reader.onload = async (e) => {
      const text = e?.target?.result;
      const result = Papa.parse(text as any, { header: true });
      setData(result.data);
    };
    reader.readAsText(file);
  }, []);

  const hasAnyError = useMemo(() => {
    let hasAnyError = false;
    for (const datum of data) {
      for (const [name, field] of fieldsAvailable.entries()) {
        const value = datum[name];
        const isValueDefined = value || !isNaN(value);
        if (field.required && !isValueDefined) {
          if (field.importProps?.extraFields?.length) {
            for (const extraField of field.importProps?.extraFields ?? []) {
              const isValueDefined2 =
                datum[extraField] || !isNaN(datum[extraField]);
              if (isValueDefined2) {
                hasAnyError = false;
                break;
              } else return true;
            }
          } else return true;
        }
      }
    }
    return hasAnyError;
  }, [data, fieldsAvailable]);

  const renderErrorColumn = useCallback(
    (e: CrudFieldProps<T>) => {
      return (value, obj) => {
        const isValueDefined = value || !isNaN(value);
        if (e.required && !isValueDefined) {
          let message = t("err.validation.required");
          if (e.importProps?.extraFields?.length) {
            const extraFields = e.importProps?.extraFields;
            const hasError = extraFields?.find((f) => !obj[f]);
            if (hasError) {
              message =
                "Either one of these fields is required: " +
                [e.name, ...extraFields].join(", ");
            }
          }
          return (
            <Tooltip className="d-flex" title={message}>
              <WarningTwoTone twoToneColor={"#ee9702"} />
              {value}
            </Tooltip>
          );
        }
        return value;
      };
    },
    [t]
  );
  const progressCallback = useCallback(async (progress: number) => {
    setProgress(progress);
  }, []);

  const onImport = useCallback(async () => {
    try {
      setLoading(true);
      await importProps.onClickImport(data, progressCallback);
      onCloseMethod(false);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [data, importProps, onCloseMethod, progressCallback]);

  const { modal } = App.useApp();

  const onclickSubmit = useCallback(async () => {
    if (hasAnyError) {
      if (modal.warning) {
        modal.warning({
          title: t("str.warning"),
          content: t("qus.importWithIssues"),
          okText: t("str.import"),
          onOk: onImport,
          okCancel: true,
          closable: true,
        });
      } else {
        console.error(
          "You must wrap your react app with App component. https://ant.design/components/app"
        );
        if (window.confirm(t("qus.importWithIssues"))) {
          onImport();
        }
      }
    } else {
      onImport();
    }
  }, [hasAnyError, onImport, t]);
  return (
    <Modal
      title={[t("str.import"), importProps?.name].filter(Boolean).join(" ")}
      width={"100%"}
      open={open}
      onOk={onclickSubmit}
      destroyOnHidden
      onCancel={() => onCloseMethod(false)}
      okText={t("str.import")}
      confirmLoading={loading}
      okButtonProps={{
        disabled: !data?.length,
      }}
      footer={(_, { OkBtn, CancelBtn }) => (
        <Space>
          <CancelBtn />
          <OkBtn />
          {hasAnyError && (
            <Tooltip
              className="d-flex"
              title={"Some fields have issue. Please review before submit."}
            >
              <WarningTwoTone twoToneColor={"#ee9702"} />
            </Tooltip>
          )}
        </Space>
      )}
    >
      <Space>
        <ButtonComponent
          onClick={onClickDownloadTemplate}
          icon={<DownloadOutlined />}
        >
          {t("str.downloadCsvTemplate")}
        </ButtonComponent>
        <ImportButton
          disabled={loading}
          type="default"
          onClick={onClickImport}
          accept=".csv"
        >
          {t("str.importCsvFile")}
        </ImportButton>
      </Space>
      <Spin
        spinning={loading}
        indicator={
          progress ? (
            <Progress
              type="circle"
              percent={progress * 100}
              size={50}
              format={(p) => `${parseInt(p as any)}%`}
            />
          ) : undefined
        }
      >
        <CrudViewer
          data={data}
          bordered
          size="small"
          fields={Array.from(fieldsAvailable.values()).flatMap((e) => {
            if (e.type === "text") {
              return [
                {
                  ...e,
                  label: e.name,
                  render: renderErrorColumn(e),
                },
                ...(e.importProps?.extraFields?.map((f) => ({
                  ...e,
                  name: f as any,
                  label: f,
                  render: renderErrorColumn(e),
                })) ?? []),
              ];
            } else if (e.type === "select") {
              return [
                {
                  ...e,
                  label: e.name,
                  type: "text" as CrudFieldProps<T>["type"],
                  render: renderErrorColumn(e),
                },
                ...(e.importProps?.extraFields?.map((f) => ({
                  ...e,
                  name: f as any,
                  label: f,
                  type: "text" as CrudFieldProps<T>["type"],
                  render: renderErrorColumn(e),
                })) ?? []),
              ] as any[];
            }
            return [
              {
                ...e,
                label: e.name,
                render: renderErrorColumn(e),
              },
            ];
          })}
        />
      </Spin>
    </Modal>
  );
}

export default CrudImportComponent;
