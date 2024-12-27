/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { t } from 'i18next';
import React, { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonComponent from '../button/Button';
import { TRANSLATION_NAMESPACE } from '../../locale/hooks/translation-constants';

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
  successTitle = t('str.success'),
  successMessage,
  errorMessage = t('err.save'),
  errorTitle = t('str.error'),

  loadingTitle = t('message.loading.saving'),
  loadingMessage,
}) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

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
            ? errorMessage() ?? t('err.save')
            : errorMessage ?? t('err.save')
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
                {t('str.previous')}
              </ButtonComponent>
            )}
            {Boolean(onRetry) && (
              <ButtonComponent
                type="primary"
                key="retry"
                onClick={() => onRetry!(undefined, undefined, true)}
              >
                {t('str.retry')}
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
