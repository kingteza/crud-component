/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Result, Skeleton } from 'antd';
import React, { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonComponent from '../button/Button';
import { TRANSLATION_NAMESPACE } from 'locale/hooks/translation-constants';

const LoadingIndicator: FC<PropsWithChildren<{
  loading: boolean;
  error?: any;
}>> = ({ loading, children, error }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  return (
    // <Spin spinning={loading} className="h-100">
      <Skeleton loading={loading} paragraph className='h-100'>
        {error ? (
          <Result
            status={'404'}
            title={404}
            subTitle={t("err.notFound")}
            className=""
            extra={
              <ButtonComponent to={-1} type="primary">
                {t("str.goBack")}
              </ButtonComponent>
            }
          />
        ) : (
          children
        )}
      </Skeleton>
    // </Spin>
  );
};

export default LoadingIndicator;
