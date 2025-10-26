/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import "./style.css";

import {
  ExportOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { Form, Modal, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/lib";

import mime from "mime";
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslationLib } from "../locale";


import { InitialCrudField } from "./CrudComponent";
import { FileDownloadProvider, FileUploadProvider } from "./ImageCrudField";
import ValidationUtil from "../util/ValidationUtil";
import { ButtonComponent } from "../common";
import { VerticalSpace } from "../common";
import CrudUtil from "src/util/CrudUtil";

export interface FileCrudField<T> extends _FileCrudField<T> {
  type: "file";
}

export interface _FileCrudField<T> extends InitialCrudField<T> {
  provider: FileUploadProvider;
  onUploading?: (isUploading: boolean) => void;
  onRemoved?: () => void;
  fieldClassName?: string;
  accept?: string;
  maxCount?: number;
  block?: boolean;
  help?: ReactNode;
}

export default function FileCrudFieldComponent<T>({
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
  fieldHelper: help,
  ...props
}: Readonly<_FileCrudField<T>>) {
  const form = Form.useFormInstance();
  const realName = CrudUtil.getRealName(name, 'upsertFieldName');
  const fieldValue = Form.useWatch(realName, form);

  const [isUploading, setIsUploading] = useState(false);
  const [isUpload, setIsUpload] = useState(false); // Indicate whether this is a upload
  const customRequest: Exclude<UploadProps["customRequest"], null | undefined> =
    useCallback(
      async (options) => {
        try {
          const { file } = options;
          const filename = (file as any).name;
          setIsUploading(true);
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

          onUploading?.(false);

          form.setFieldValue(name as any, finalPath);
          options.onSuccess?.(finalPath);
        } catch (e) {
          options.onError?.(e as any);
        } finally {
          setIsUploading(false);
        }
      },
      [form, name, onUploading, provider]
    );

  const [fileList, setFileList] = useState<any>([]);
  useEffect(() => {
    if (!isUpload && fieldValue) {
      Promise.all(
        (Array.isArray(fieldValue) ? fieldValue : [fieldValue]).map(
          async (e) => {
            const mimeType = mime.getType(e);
            const fileName = e.split("/").pop();
            const url = await provider.getRealUrl(e);
            return {
              uid: e,
              url,
              type: mimeType,
              name: fileName,
            };
          }
        )
      ).then((value) => {
        return setFileList(() => {
          const list = value.map(({ url, type, uid, name }) => {
            return { uid, url, type, response: uid, thumbUrl: url, name };
          });
          return list as any;
        });
      });
    }
  }, [fieldValue, isUpload, isUploading, provider]);

  const onRemove = useCallback(
    async (file: UploadFile<any>) => {
      const filePath = file.response;
      const path = filePath ? filePath : form.getFieldValue(name);
      await provider.delete(path);
      onRemoved?.();
      if (file) form.setFieldsValue({ [name as any]: null });
    },
    [form, name, onRemoved, provider]
  );

  return (
    <Form.Item
      label={label}
      required={required}
      name={name as any}
      className={fieldClassName}
      rules={[
        ...(required ? ValidationUtil.required(label) : []),
        ...(rules ?? []),
      ]}
      help={help}
    >
      <input hidden />
      <Upload
        {...props}
        fileList={fileList}
        className={(fileList?.length ?? 0) >= maxCount ? "hide-upload" : ""}
        maxCount={maxCount}
        customRequest={customRequest}
        onRemove={onRemove}
        listType="picture"
        onChange={({ fileList }) => {
          setFileList(fileList);
        }}
        style={block ? { width: "100%" } : undefined}
      >
        <ButtonComponent loading={isUploading}>Upload File</ButtonComponent>
      </Upload>
    </Form.Item>
  );
}

export const FileCrudCellValue: FC<{
  value: string;
  provider: FileDownloadProvider;
}> = ({ provider, value }) => {
  const [url, setUrl] = useState<{
    mimeType: string | null;
    url: string;
    fileName: string;
  }>();
  useEffect(() => {
    if (value)
      provider.getRealUrl(value).then((e) => {
        setUrl({
          mimeType: mime.getType(value),
          url: e,
          fileName: value.split("/").pop() ?? value,
        });
      });
  }, [provider, value]);
  if (!url) {
    return <></>;
  }
  return (
    <FileCellValue
      fileName={url.fileName}
      url={url?.url}
      mimeType={url?.mimeType}
    />
  );
};

export const FileCellValue: FC<{
  url: string;
  mimeType?: string | null;
  fileName: string;
}> = ({ url, mimeType = "", fileName }) => {
  const type = useMemo(() => {
    if (mimeType?.includes("image")) {
      return "image";
    } else if (mimeType?.includes("pdf")) {
      return "pdf";
    } else if (mimeType?.includes("word")) {
      return "word";
    } else if (mimeType?.includes("text")) {
      return "text";
    } else if (mimeType?.includes("presentation")) {
      return "presentation";
    } else if (
      mimeType?.includes("excel") ||
      mimeType?.includes("spreadsheet")
    ) {
      return "excel";
    } else {
      return "file";
    }
  }, [mimeType]);

  const icon = useMemo(() => {
    switch (type) {
      case "image":
        return <FileImageOutlined />;
      case "pdf":
        return <FilePdfOutlined />;
      case "word":
        return <FileWordOutlined />;
      case "text":
        return <FileTextOutlined />;
      case "excel":
        return <FileExcelOutlined />;
      case "presentation":
        return <FilePptOutlined />;
      default:
        return <FileOutlined />;
    }
  }, [type]);

  const [openModal, setOpenModal] = useState(false);

  const { t } = useTranslationLib();

  if (type !== "file" && type !== "text") {
    return (
      <>
        <Modal
          open={openModal}
          title={fileName}
          onCancel={() => setOpenModal(false)}
          footer={<></>}
          width={"100%"}
          style={{ top: "8px", minHeight: "700px" }}
          destroyOnHidden
        >
          <VerticalSpace>
            <ButtonComponent
              tooltip={fileName}
              icon={<ExportOutlined />}
              target="_blank"
              href={url}
              style={{ textDecoration: "none" }}
            >
              {t("str.openInNewTab")}
            </ButtonComponent>
            {type === "image" ? (
              <img src={url} alt={fileName} style={{ width: "100%" }} />
            ) : type === "pdf" ? (
              <iframe title={fileName} src={url} width="100%" height="700px">
                This browser does not support PDFs. Please download the PDF to
                view it:
                <a href={url}>Download PDF</a>
              </iframe>
            ) : (
              <iframe
                title={fileName}
                src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                  url
                )}`}
                width="100%"
                height="700px"
              >
                This browser does not support open {type.toUpperCase()}. Please
                download the
                {type.toUpperCase()} to view it:
                <a href={url}>Download {type.toUpperCase()}</a>.
              </iframe>
            )}
          </VerticalSpace>
        </Modal>
        <ButtonComponent
          tooltip={fileName}
          icon={icon}
          shape="circle"
          onClick={() => setOpenModal(true)}
        />
      </>
    );
  } else {
    return (
      <ButtonComponent
        tooltip={fileName}
        icon={icon}
        target="_blank"
        href={url}
        shape="circle"
      ></ButtonComponent>
    );
  }
};
