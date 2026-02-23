/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import {
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Col, Form, Row, Upload } from "antd";
import { UploadFile } from "antd/lib";
import mime from "mime";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import ValidationUtil from "../util/ValidationUtil";
import { InitialCrudField } from "./CrudComponent";
import { FileUploadProvider } from "./ImageCrudField";

const { Dragger } = Upload;

export interface FileCrudDragNDropFieldProps<T> extends _FileCrudDragNDropField<T> {
  type: "file";
}

export interface _FileCrudDragNDropField<T> extends InitialCrudField<T> {
  provider: FileUploadProvider;
  onUploading?: (isUploading: boolean) => void;
  onRemoved?: () => void;
  fieldClassName?: string;
  accept?: string;
  maxCount?: number;
  block?: boolean;
  fieldHelper?: ReactNode;
  formLayoutProps?: InitialCrudField<T>["formLayoutProps"];
  showInGrid?: boolean;
  gridConfig?: {
    draggerSpan?: number;
    previewSpan?: number;
  };
}

export default function FileCrudDragNDropField<T>({
  name,
  label,
  required,
  provider,
  onUploading,
  onRemoved,
  fieldClassName,
  accept,
  rules,
  maxCount = 1,
  block,
  showInGrid = false,
  gridConfig = {
    draggerSpan: 12,
    previewSpan: 12,
  },
  fieldHelper: help,
  formLayoutProps,
  ...props
}: Readonly<_FileCrudDragNDropField<T>> & Omit<UploadProps, "customRequest">) {
  const form = Form.useFormInstance();
  const namePath = useMemo(() => name as any, [name]);
  const fieldValue = Form.useWatch(namePath, form);

  const [isUpload, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const customRequest: Exclude<UploadProps["customRequest"], null | undefined> =
    useCallback(
      async (options) => {
        const file = (options as any).file;
        const filename = (file as any)?.name ?? "";

        const tempUid = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        setFileList((prev) => [
          ...prev,
          {
            uid: tempUid,
            name: filename,
            status: "uploading",
            originFileObj: file,
          } as UploadFile<any>,
        ]);

        try {
          setIsUpload(true);
          onUploading?.(true);

          const fileName = filename ?? "";
          const array = fileName.split(".");
          const extension = array[array.length - 1];
          const name0 = provider.generateFileName(fileName);

          const filePath = `${await provider.getInitialPath()}/${name0}.${extension}`;
          const finalPath = await provider.upload(
            { ...(file as any), originFileObj: file },
            filePath
          );

          const url = await provider.getRealUrl(finalPath);
          const mimeType = mime.getType(finalPath);

          const currentValue = form.getFieldValue(namePath);
          if (maxCount > 1) {
            const normalized = Array.isArray(currentValue)
              ? currentValue
              : currentValue
              ? [currentValue]
              : [];
            const newValue = [...normalized, finalPath].filter(Boolean);
            form.setFieldValue(namePath, newValue);
          } else {
            form.setFieldValue(namePath, finalPath);
          }

          setFileList((prev) =>
            prev.map((item) =>
              item.uid === tempUid
                ? ({
                    uid: finalPath,
                    url,
                    type: mimeType,
                    name: fileName,
                    status: "done",
                    response: finalPath,
                    thumbUrl: url,
                  } as UploadFile<any>)
                : item
            )
          );

          (options as any).onSuccess?.(finalPath);
        } catch (e) {
          (options as any).onError?.(e as any);
          setFileList((prev) => prev.filter((item) => item.uid !== tempUid));
        } finally {
          onUploading?.(false);
        }
      },
      [form, maxCount, onUploading, provider, namePath]
    );

  useEffect(() => {
    if (!isUpload && fieldValue) {
      Promise.all(
        (Array.isArray(fieldValue) ? fieldValue : [fieldValue]).map(async (e) => {
          const mimeType = mime.getType(e);
          const fileName = e.split("/").pop();
          const url = await provider.getRealUrl(e);
          return { uid: e, url, type: mimeType, name: fileName, response: e, thumbUrl: url };
        })
      ).then((list) => setFileList(list as any));
    }
  }, [fieldValue, isUpload, provider]);

  const onRemove = useCallback(
    async (file: UploadFile<any>) => {
      const filePath = (file as any).response ?? file.uid;
      await provider.delete(filePath);
      onRemoved?.();

      const currentValue = form.getFieldValue(namePath);
      if (maxCount > 1) {
        const normalized = Array.isArray(currentValue)
          ? currentValue
          : currentValue
          ? [currentValue]
          : [];
        const newValue = normalized.filter((v) => v !== filePath);
        form.setFieldValue(namePath, newValue.length ? newValue : undefined);
      } else {
        form.setFieldValue(namePath, undefined);
      }

      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    [form, maxCount, onRemoved, provider, namePath]
  );

  const acceptedLabel = useMemo(() => {
    if (!accept) return "all files";
    const types = accept.split(",").map((type) => {
      const clean = type.trim().toLowerCase();
      if (clean.startsWith("image/")) return "images";
      if (clean === ".pdf" || clean === "application/pdf") return "PDF files";
      if (clean.includes("excel") || clean.includes(".xls")) return "Excel files";
      if (clean.includes("word") || clean.includes(".doc")) return "Word files";
      if (clean.includes("text") || clean === ".txt") return "text files";
      if (clean.includes("presentation") || clean.includes(".ppt")) return "PowerPoint files";
      return clean.replace(".", "").toUpperCase();
    });
    return [...new Set(types)].join(", ");
  }, [accept]);

  const uploadIcon = useMemo(() => {
    if (!accept) return <InboxOutlined />;
    if (accept.includes("image")) return <FileImageOutlined />;
    if (accept.includes("pdf")) return <FilePdfOutlined />;
    if (accept.includes("word") || accept.includes(".doc")) return <FileWordOutlined />;
    if (accept.includes("text") || accept.includes(".txt")) return <FileTextOutlined />;
    if (accept.includes("excel") || accept.includes(".xls")) return <FileExcelOutlined />;
    if (accept.includes("presentation") || accept.includes(".ppt")) return <FilePptOutlined />;
    return <FileOutlined />;
  }, [accept]);

  const reachedMax = (fileList?.length ?? 0) >= maxCount;

  return (
    <Form.Item
      label={label}
      required={required}
      name={namePath}
      {...formLayoutProps}
      className={fieldClassName}
      rules={[
        ...(required ? ValidationUtil.required(label) : []),
        ...(rules ?? []),
      ]}
      help={help}
    >
      <input hidden />

      <Row gutter={[8, 8]} align="top" style={{ width: "100%", margin: 0 }}>
        <Col span={showInGrid ? gridConfig.draggerSpan : 24} xs={24} sm={24}>
          <Dragger
            {...(props as any)}
            accept={accept}
            disabled={reachedMax}
            fileList={[]}
            multiple={maxCount > 1}
            maxCount={maxCount}
            customRequest={customRequest}
            onRemove={onRemove}
            onChange={({ file }) => {
              if ((file as any).status === "error") {
                setFileList((prev) => prev.filter((item) => item.uid !== (file as any).uid));
              }
            }}
            style={block ? { width: "100%" } : undefined}
          >
            <p className="ant-upload-drag-icon">{uploadIcon}</p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              {`Maximum file size: 10 MB. Supported formats: ${acceptedLabel}. ${
                maxCount > 1 ? `Maximum number of files: ${maxCount}` : ""
              }`}
            </p>
          </Dragger>
        </Col>

        {fileList.length > 0 && (
          <Col span={showInGrid ? gridConfig.previewSpan : 24} xs={24} sm={24}>
            <Upload
              {...(props as any)}
              accept={accept}
              fileList={fileList}
              maxCount={maxCount}
              customRequest={customRequest}
              onRemove={onRemove}
              listType="picture"
              onChange={({ fileList }) => setFileList(fileList as any)}
              style={{ width: "100%" }}
            />
          </Col>
        )}
      </Row>
    </Form.Item>
  );
}

