/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { EyeOutlined } from "@ant-design/icons";
import { Avatar, Form, Image, Input } from "antd";
import { UploadListType } from "antd/es/upload/interface";
import { UploadFile } from "antd/lib";
import path from "path-browserify";
import React, {
  FC,
  ForwardedRef,
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import NumberUtil from "../util/NumberUtil";
import ValidationUtil from "../util/ValidationUtil";
import { v4 as uuidV4 } from "uuid";

import { InitialCrudField } from "./CrudComponent";
import { ImagePicker } from "../common";
import { ImageUtil } from "../util";

export interface _ImageCrudField<T> extends InitialCrudField<T> {
  provider: FileUploadProvider;
  onUploading?: (isUploading: boolean) => void;
  onRemoved?: () => void;
  aspectRatio?: number;
  fieldClassName?: string;
  listType?: UploadListType;
  showSkipCropButton?: boolean;
  skipResize?: boolean;
  asyncUpload?: boolean;
  maxCount?: number;
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

export interface ImageCrudFieldRef {
  uploadBlob: (blob: Blob, fileName: string) => Promise<void>;
}

function Component<T>(
  {
    formLayoutProps,
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
    showSkipCropButton = false,
    skipResize = false,
    asyncUpload = false,
    maxCount = 1,
  }: Readonly<_ImageCrudField<T>>,
  ref: ForwardedRef<ImageCrudFieldRef>
) {
  const formInstance = Form.useFormInstance();
  const namePath = name as any;

  const fieldValue = Form.useWatch(namePath, formInstance);

  const getRealUrl = useCallback(
    (filePath: string) => provider.getRealUrl(filePath),
    [provider]
  );

  const onChange = useCallback(
    async (e: UploadFile<any>, isAdd: boolean): Promise<string | void> => {
      if (isAdd) {
        onUploading?.(true);
        try {
          const fileName = e.name;
          const array = fileName.split(".");
          const extension = array[array.length - 1];
          const name0 = provider.generateFileName(fileName);

          const filePath = `${await provider.getInitialPath()}/${name0}.${extension}`;
          const finalPath = await provider.upload(e, filePath);

          const currentValue = formInstance.getFieldValue(namePath);
          if (maxCount > 1) {
            const normalized = Array.isArray(currentValue)
              ? currentValue
              : currentValue
                ? [currentValue]
                : [];
            formInstance.setFieldValue(namePath, [
              ...normalized,
              finalPath,
            ].filter(Boolean));
          } else {
            formInstance.setFieldValue(namePath, finalPath);
          }
          return finalPath;
        } finally {
          onUploading?.(false);
        }
      } else {
        const currentValue = formInstance.getFieldValue(namePath);
        if (maxCount > 1) {
          const path =
            (e as any).response ??
            (typeof e.uid === "string" ? e.uid : undefined);
          if (!path) return;
          await provider.delete(path);
          onRemoved?.();
          const normalized = Array.isArray(currentValue)
            ? currentValue
            : currentValue
              ? [currentValue]
              : [];
          const newValue = normalized.filter((v) => v !== path);
          formInstance.setFieldValue(
            namePath,
            newValue.length ? newValue : null
          );
        } else {
          const deleted = await provider.delete(currentValue);
          onRemoved?.();
          if (deleted) formInstance.setFieldValue(namePath, null);
        }
      }
    },
    [formInstance, maxCount, namePath, onRemoved, onUploading, provider]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        async uploadBlob(blob: Blob, fileName: string) {
          const url = await ImageUtil.getBase64(blob);

          const file = {
            name: fileName,
            uid: fileName + Math.random().toString(36).substring(2, 15),
            url: url,
            originFileObj: blob as any,
          };
          await onChange(file, true);
        },
      };
    },
    [onChange]
  );

  const pickerValues = useMemo(() => {
    if (!fieldValue) return maxCount > 1 ? [] : undefined;
    return Array.isArray(fieldValue)
      ? (fieldValue as string[])
      : (fieldValue as string);
  }, [fieldValue, maxCount]);

  return (
    <Form.Item
      rules={required ? ValidationUtil.required(label) : []}
      label={hideLabel ? null : label}
      required={required}
      name={namePath}
      help={help}
      {...formLayoutProps}
      className={fieldClassName}
    >
      <ImagePicker
        noStyle
        asyncUpload={asyncUpload}
        listType={listType}
        aspectRatio={aspectRatio}
        values={pickerValues}
        getRealUrl={getRealUrl}
        onRemove={(e) => {
          if (e) onChange(e, false);
        }}
        onAdd={async (e) => {
          if (e) return onChange(e, true);
        }}
        className={fieldClassName}
        showSkipCropButton={showSkipCropButton}
        skipResize={skipResize}
        maxCount={maxCount}
      />
      <Input hidden />
    </Form.Item>
  );
}

const ImageCrudField = React.forwardRef(Component) as <T>(
  p: Readonly<_ImageCrudField<T>> & { ref?: Ref<ImageCrudFieldRef> }
) => ReactElement;

export default ImageCrudField;

export const ImageCrudCellValue: FC<{
  value: string | string[];
  provider: FileDownloadProvider;
}> = ({ provider, value }) => {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    if (!value) {
      setUrls([]);
      return;
    }
    const paths = Array.isArray(value) ? value : [value];
    Promise.all(paths.filter(Boolean).map((p) => provider.getRealUrl(p))).then(
      setUrls
    );
  }, [provider, value]);
  if (!urls.length) {
    return <></>;
  }
  return (
    <>
      {urls.map((url) => (
        <ImageCellValue key={url} url={url} />
      ))}
    </>
  );
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
