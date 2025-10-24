/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import "./style.css";

import { EyeOutlined } from "@ant-design/icons";
import { Avatar, Form, Image, Input } from "antd";
import { UploadListType } from "antd/es/upload/interface";
import { UploadFile } from "antd/lib";
import path from "path-browserify";
import { FC, useCallback, useEffect, useState } from "react";
import NumberUtil from "../util/NumberUtil";
import ValidationUtil from "../util/ValidationUtil";
import { v4 as uuidV4 } from "uuid";

import { InitialCrudField } from "./CrudComponent";
import { ImagePicker } from "../common";

export interface _ImageCrudField<T> extends InitialCrudField<T> {
  provider: FileUploadProvider;
  onUploading?: (isUploading: boolean) => void;
  onRemoved?: () => void;
  aspectRatio?: number;
  fieldClassName?: string;
  listType?: UploadListType;
}

export interface ImageCrudField<T> extends _ImageCrudField<T> {
  type: "image";
}

export abstract class FileDownloadProvider {
  public abstract getRealUrl(filePath?: string): Promise<string>;
}

export abstract class FileUploadProvider extends FileDownloadProvider {
  public rootPath: string;
  public subPath: string;
  constructor(rootPath: string = "", subPath: string = "") {
    super();
    this.rootPath = rootPath;
    this.subPath = subPath;
  }

  cloneFilePath(filePath: string) {
    const parsed = path.parse(filePath);
    const newFileName = `${parsed.name}_cloned_${NumberUtil.randInt(100000)}`;
    const newFilePath = path.format({
      dir: parsed.dir,
      ext: parsed.ext,
      name: newFileName,
    });
    return newFilePath;
  }

  public abstract getInitialPath(): Promise<string>;

  public abstract upload(
    file: UploadFile<any>,
    filePath: string
  ): Promise<string>;

  public abstract delete(filePath: string): Promise<boolean>;

  public abstract clone(filePath: string): Promise<string>;

  public abstract getRealUrl(filePath: string): Promise<string>;

  public generateFileName(initialFileName: string) {
    const nameOnly = initialFileName.split(".")[0];
    const fileName = `${nameOnly}_${uuidV4().replace("-", "")}`;
    return fileName;
  }
}

export default function ImageCrudFieldComponent<T>({
  name,
  label,
  required,
  provider,
  onUploading,
  aspectRatio,
  onRemoved,
  fieldClassName,
  hideLabel = false,
  listType,
  fieldHelper: help,
}: Readonly<_ImageCrudField<T>>) {
  const formInstance = Form.useFormInstance();

  const fieldValue = Form.useWatch(name, formInstance);

  const [isUpload, setIsUpload] = useState(false);
  const onChange = useCallback(
    async (e: UploadFile<any>, isAdd: boolean) => {
      if (isAdd) {
        // We are adding new one
        onUploading?.(true);
        const fileName = e.name;
        const array = fileName.split(".");
        const extension = array[array.length - 1];
        const name0 = provider.generateFileName(fileName);

        const filePath = `${await provider.getInitialPath()}/${name0}.${extension}`;
        const finalPath = await provider.upload(e, filePath);
        setIsUpload(true);
        onUploading?.(false);
        formInstance.setFieldValue(name as any, finalPath);
      } else {
        console.log(e);
        // We are removing

        const form = formInstance.getFieldsValue();
        const file = await provider.delete(form[name]);
        onRemoved?.();
        if (file) formInstance.setFieldsValue({ [name as any]: null });
      }
    },
    [formInstance, name, onRemoved, onUploading, provider]
  );

  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (!isUpload && fieldValue) {
      provider.getRealUrl(fieldValue).then(setValue);
    } else {
      setValue(value);
    }
  }, [fieldValue, isUpload, provider, value]);

  return (
    <Form.Item
      rules={required ? ValidationUtil.required(label) : []}
      label={hideLabel ? null : label}
      required={required}
      name={name as any}
      help={help}
    >
      <ImagePicker
        noStyle
        listType={listType}
        aspectRatio={aspectRatio}
        values={value}
        onRemove={(e) => {
          if (e) onChange(e, false);
        }}
        onAdd={async (e) => {
          if (e) await onChange(e, true);
        }}
        className={fieldClassName}
      />
      <Input hidden />
    </Form.Item>
  );
}

export const ImageCrudCellValue: FC<{
  value: string;
  provider: FileDownloadProvider;
}> = ({ provider, value }) => {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (value) provider.getRealUrl(value).then(setUrl);
  }, [provider, value]);
  if (!url) {
    return <></>;
  }
  return <ImageCellValue url={url} />;
};

export const ImageCellValue: FC<{ url: string }> = ({ url }) => {
  return (
    <Avatar className="p-0">
      <Image
        className="m-0 p-0 position-relative"
        src={url}
        preview={{
          mask: <EyeOutlined />,
        }}
      ></Image>
    </Avatar>
  );
};
