/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Result, Skeleton, Spin } from 'antd';
import React, { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../config/localization/translations';
import ButtonComponent from '../button/Button';

const LoadingIndicator: FC<PropsWithChildren<{
  loading: boolean;
  error?: any;
}>> = ({ loading, children, error }) => {
  const { t } = useTranslation();
  return (
    // <Spin spinning={loading} className="h-100">
      <Skeleton loading={loading} paragraph className='h-100'>
        {error ? (
          <Result
            status={'404'}
            title={404}
            subTitle={t(translations.err.notFound)}
            className=""
            extra={
              <ButtonComponent to={-1} type="primary">
                {t(translations.str.goBack)}
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
