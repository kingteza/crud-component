/* eslint-disable prefer-const */
/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import "cropperjs/dist/cropper.css";
import "./style.css";

import {
  LoadingOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Form, FormItemProps } from "antd";
import { Modal } from "antd";
import { Upload, UploadProps } from "antd";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
const FormItem = Form.Item;
import { UploadListType } from "antd/es/upload/interface";
import { Cropper, ReactCropperElement } from "react-cropper";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";

import ButtonComponent from "../button/Button";
import ImageUtil from "util/ImageUtil";

function getBase64(file) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function dataURLtoFile({ url, name }) {
  let arr = url.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], name, { type: mime });
}
interface Props extends FormItemProps {
  values?: string[] | string;
  maxCount?: number;
  onChange?: (file?: UploadFile, allFiles?: UploadFile[]) => void;
  buttonTitle?: string;
  listType?: UploadListType;
  hidePreview?: boolean;
  buttonSize?: string;
  showButtonText?: boolean;
  aspectRatio?: number;
  showOnlyIcon?: boolean;
  icon?: ReactElement;
  loading?: boolean;
  buttonType?: string;
  onAdd?: (file?: UploadFile) => Promise<void>;
  onRemove?: (file?: UploadFile) => void;
}

/**
 * When submitting Uploader
 * ```
 *  if(field === undefined)
 *  "There is no file uploaded"
 *  else if(field.fileList.length === 0)
 *  "The initial file is deleted"
 *  else if(field.fileList.length > 1)
 *  "A new file has been uploaded"
 * ```
 *
 */
const ImagePicker: FC<Props> = ({
  values = [],
  required,
  buttonType,
  label,
  name,
  onChange,
  aspectRatio,
  buttonTitle,
  hidePreview,
  buttonSize = "large",
  showButtonText = true,
  showOnlyIcon = false,
  icon = <UploadOutlined />,
  loading,
  maxCount = 1,
  onAdd,
  onRemove,
  listType,
  ...props
}) => {
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const fileRef = useRef<RcFile>();
  const cropper = useRef<ReactCropperElement>();
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]);
  const [preview, setPreview] = useState<string>();
  const beforeUploadRef = useRef<UploadProps["beforeUpload"]>();

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name);
  };
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const handleCropChange = () => {};

  const handleRotate = (isLeft?: boolean) => {
    cropper?.current?.cropper.rotate(isLeft ? -90 : 90);
    handleCropChange();
  };

  useEffect(() => {
    onChange?.(fileList[0], fileList);
  }, [fileList, onChange]);

  const onClickConfirmCrop = () => {
    const croppedImgData = cropper?.current?.cropper.getCroppedCanvas();

    // get the new image
    const { type, size, name, uid } = fileRef.current as any;

    setShowLoadingIndicator(true);
    // const file: any = dataURLtoFile({ url, name });
    croppedImgData?.toBlob(async (blob: any) => {
      const file = Object.assign(new File([blob], name, { type }), {
        uid,
      }) as RcFile;
      const fileResized: RcFile = await ImageUtil.resizeImage(file);
      const url = await getBase64(fileResized);
      const fl = {
        url,
        name,
        uid,
        type,
        size,
        thumbUrl: url,
        originFileObj: fileResized,
      };
      if (onAdd) {
        try {
          setShowLoadingIndicator(true);
          await onAdd(fl);
        } finally {
          setShowLoadingIndicator(false);
        }
      }
      setFileList([fl, ...fileList]);
      setShowLoadingIndicator(false);
      // if (beforeUploadRef?.current) beforeUploadRef?.current(file, [file]);
    });
    setPreview(undefined);
  };

  const onClickCancelCrop = () => {
    setPreview(undefined);
    fileRef.current = undefined;
  };

  const onChangeFile = useCallback((f) => {
    const file = f;
    if (file) {
      fileRef.current = file;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
          const b = localStorage.getItem("cropper.box");
          const box = b ? JSON.parse(b) : undefined;
          if (box) {
            // cropper?.current?.cropper.
            cropper?.current?.cropper.setCropBoxData(box);
          }
          setTimeout(() => {
            onCropMove();
          }, 100);
        }
      });
      reader.readAsDataURL(file);
    }
  }, []);
  useEffect(() => {
    if (values?.length || typeof values === "string") {
      const list = Array.isArray(values)
        ? values.map((url) => {
            return [{ uid: values, url }];
          })
        : [{ uid: values, url: values }];
      setFileList(list as any);
    }
  }, [values]);
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  const validator = useMemo(
    () =>
      required
        ? {
            required,
            validator: (_, __, callback) => {
              if (preview || fileList?.length) callback();
              else callback(`${label ?? ""} ${t("err.validation.required")}`);
            },
          }
        : undefined,
    [required, preview, fileList?.length, label, t]
  );

  const _buttonTitle = buttonTitle ?? t("message.fileUploadMessage2");

  const uploadComponent = useMemo(
    () => (
      <UploadComponent
        showLoadingIndicator={showLoadingIndicator}
        _buttonTitle={_buttonTitle}
        buttonSize={buttonSize}
        buttonType={buttonType}
        fileList={fileList}
        hidePreview={hidePreview}
        icon={icon}
        loading={loading}
        listType={listType}
        maxCount={maxCount}
        onChangeFile={onChangeFile}
        onRemove={onRemove}
        showButtonText={showButtonText}
        handlePreview={handlePreview}
        setFileList={setFileList}
      />
    ),
    [
      showLoadingIndicator,
      _buttonTitle,
      buttonSize,
      buttonType,
      fileList,
      hidePreview,
      icon,
      loading,
      listType,
      maxCount,
      onChangeFile,
      onRemove,
      showButtonText,
    ]
  );

  beforeUploadRef.current = uploadComponent.props.beforeUpload;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [croppedBoxData, setCroppedBoxData] = useState<Cropper.CropBoxData>();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (croppedBoxData) {
        localStorage.setItem("cropper.box", JSON.stringify(croppedBoxData));
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [croppedBoxData]);

  useEffect(() => {
    if (!preview) {
      setWidth(0);
      setHeight(0);
    }
  }, [preview]);

  const onCropMove = useCallback(async () => {
    const ref = cropper?.current?.cropper;
    if (ref) {
      const { width, height } = ref.getCroppedCanvas();
      setCroppedBoxData(ref.getCropBoxData());
      setWidth(width);
      setHeight(height);
    }
  }, []);

  return (
    <>
      <FormItem
        label={label}
        {...props}
        name={name}
        className="mb-0"
        rules={[validator, ...(props.rules ?? [])] as any}
      >
        {uploadComponent}
      </FormItem>
      <Modal
        open={Boolean(preview)}
        maskClosable={false}
        onOk={onClickConfirmCrop}
        closable={false}
        onCancel={onClickCancelCrop}
      >
        <Cropper
          ref={cropper as any}
          src={preview}
          cropmove={onCropMove}
          viewMode={1}
          // width={'150%'}
          aspectRatio={aspectRatio}
          cropend={() => handleCropChange()}
        />
        <p className="text-center">{[width, height].join(" ⨉ ")}</p>
        <div className="mt-2 d-flex justify-content-center">
          <ButtonComponent
            size="large"
            icon={<RotateLeftOutlined />}
            onClick={() => handleRotate(true)}
          />
          <ButtonComponent
            size="large"
            icon={<RotateRightOutlined />}
            onClick={() => handleRotate(false)}
          />
        </div>
      </Modal>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="text-center">
          <img alt="example" style={{ maxWidth: "400px" }} src={previewImage} />
        </div>
      </Modal>
    </>
  );
};

export const UploadComponent: FC<{
  _buttonTitle;
  buttonSize;
  buttonType;
  fileList;
  hidePreview;
  icon;
  loading;
  maxCount;
  onChangeFile;
  onRemove;
  showButtonText;
  handlePreview;
  setFileList;
  showLoadingIndicator?: boolean;
  listType?: UploadListType;
}> = ({
  _buttonTitle,
  buttonSize,
  buttonType,
  fileList,
  hidePreview,
  icon,
  loading,
  maxCount,
  onChangeFile,
  onRemove,
  showButtonText,
  handlePreview,
  setFileList,
  showLoadingIndicator,
  listType = "picture",
}) => {
  return (
    <>
      <Upload
        accept="image/x-png,image/gif,image/jpeg"
        key={fileList.length}
        fileList={fileList}
        defaultFileList={fileList}
        onChange={(props) => {
          // setFileList(props.fileList);
        }}
        className={
          (fileList.length >= maxCount ? " hide-upload " : "") + " mb-0"
        }
        multiple={false}
        onPreview={!hidePreview ? handlePreview : undefined}
        onDrop={(file) => {
          // if (!file.isCropped) onChangeFile(file);
          // else setFileList([file]);
          onChangeFile(file.dataTransfer.files.item(0));
          return false;
        }}
        listType={listType}
        showUploadList={!hidePreview}
        onRemove={(file) => {
          const filtered = fileList.filter((f) => file.uid !== f.uid);
          onRemove?.(file);
          setFileList(filtered);
        }}
        beforeUpload={async (file: any) => {
          // if (!file.isCropped) onChangeFile(file);
          // else setFileList([file]);
          onChangeFile(file);
          return false;
        }}
        // height={100}
        maxCount={maxCount}
      >
        {showLoadingIndicator && <LoadingOutlined />}
        {
          <div className="d-flex flex-column">
            {fileList.length < maxCount &&
              (listType === "picture-circle" ? (
                <UploadOutlined />
              ) : (
                <ButtonComponent
                  loading={loading}
                  tooltip={!showButtonText ? _buttonTitle : undefined}
                  size={buttonSize as any}
                  icon={icon}
                  type={!showButtonText ? "text" : (buttonType as any)}
                >
                  {showButtonText ? _buttonTitle : undefined}
                </ButtonComponent>
              ))}
          </div>
        }
      </Upload>
    </>
  );
};

export default ImagePicker;
