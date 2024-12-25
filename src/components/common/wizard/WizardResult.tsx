/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { Result, Spin } from 'antd';
import { translations } from 'config/localization/translations';
import { t } from 'i18next';
import React, { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonComponent from '../button/Button';

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
  successTitle = t(translations.str.success),
  successMessage,
  errorMessage = t(translations.err.save),
  errorTitle = t(translations.str.error),

  loadingTitle = t(translations.message.loading.saving),
  loadingMessage,
}) => {
  const { t } = useTranslation();

  return (
    <Result
      status={
        loading
          ? undefined
          : success
          ? 'success'
          : error
          ? ['403', '404', '500'].includes(error?.code)
            ? error.code
            : error
            ? 'error'
            : undefined
          : undefined
      }
      title={
        loading ? loadingTitle : success ? successTitle : error ? errorTitle : undefined
      }
      icon={loading ? <LoadingOutlined /> : undefined}
      subTitle={
        loading
          ? loadingMessage
          : success
          ? successMessage
          : error
          ? typeof errorMessage === 'function'
            ? errorMessage() ?? t(translations.err.save)
            : errorMessage ?? t(translations.err.save)
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
                {t(translations.str.previous)}
              </ButtonComponent>
            )}
            {Boolean(onRetry) && (
              <ButtonComponent
                type="primary"
                key="retry"
                onClick={() => onRetry!(undefined, undefined, true)}
              >
                {t(translations.str.retry)}
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
