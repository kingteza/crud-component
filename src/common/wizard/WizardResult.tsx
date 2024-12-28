/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Result } from "antd";
import React, { FC, PropsWithChildren } from "react";

import ButtonComponent from "../button/Button";
import { useTranslationLib, t } from "../../locale";

const WizardResult: FC<
  {
    onRetry?: (_: undefined, __: undefined, retry: true) => void;

    onClickBack?: () => void;

    loading: boolean;
    error: any;
    success: boolean;

    successTitle?: string;
    successMessage?: string;

    errorTitle?: string;
    errorMessage?: string | (() => string | undefined);

    loadingTitle?: string;
    loadingMessage?: string;
    errorChildren?: React.ReactNode;
  } & PropsWithChildren
> = ({
  errorChildren,
  children,
  onRetry,
  onClickBack,
  success,
  loading,
  error,
  successTitle,
  successMessage,
  errorMessage,
  errorTitle,

  loadingTitle,
  loadingMessage,
}) => {
  const { t } = useTranslationLib();
  const successTitle0 = successTitle ?? t("str.success");
  const errorTitle0 = errorTitle ?? t("str.error");
  const errorMessage0 = errorMessage
    ? typeof errorMessage === "function"
      ? errorMessage()
      : errorMessage
    : t("err.save");
  const loadingTitle0 = loadingTitle ?? t("message.loading.saving");
  return (
    <Result
      status={
        loading
          ? undefined
          : success
          ? "success"
          : error
          ? ["403", "404", "500"].includes(error?.code)
            ? error.code
            : error
            ? "error"
            : undefined
          : undefined
      }
      title={
        loading
          ? loadingTitle0
          : success
          ? successTitle0
          : error
          ? errorTitle0
          : undefined
      }
      icon={loading ? <LoadingOutlined /> : undefined}
      subTitle={
        loading
          ? loadingMessage
          : success
          ? successMessage
          : error
          ? typeof errorMessage === "function"
            ? errorMessage() ?? errorMessage0
            : errorMessage ?? errorMessage0
          : undefined
      }
      extra={[
        success ? (
          <>{children}</>
        ) : error ? (
          <>
            {Boolean(onClickBack) && (
              <ButtonComponent
                // block
                onClick={onClickBack}
                htmlType="button"
                type="primary"
                icon={<ArrowLeftOutlined />}
              >
                {t("str.previous")}
              </ButtonComponent>
            )}
            {Boolean(onRetry) && (
              <ButtonComponent
                type="primary"
                key="retry"
                onClick={() => onRetry!(undefined, undefined, true)}
              >
                {t("str.retry")}
              </ButtonComponent>
            )}
            {errorChildren}
          </>
        ) : (
          <></>
        ),
      ]}
    ></Result>
  );
};

export default WizardResult;
