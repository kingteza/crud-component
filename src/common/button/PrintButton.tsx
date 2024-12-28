/* eslint-disable no-extra-boolean-cast */
/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { PrinterOutlined } from '@ant-design/icons';
import { ButtonType } from 'antd/lib/button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonComponent from './Button';
import { TRANSLATION_NAMESPACE } from '../../locale/hooks/translation-constants';

export const PrintButton: FC<{
  to?: string;
  loading?: boolean;
  onClick?: () => void;
  title?: string;
  type?: ButtonType;
  block?: boolean;
  className?: string;
  disabled?: boolean;
}> = ({ disabled, loading, block, className, type = 'primary', onClick, title, to }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const _title = title ?? t("str.print");
  return (
    <ButtonComponent
      type={type}
      className={className}
      to={to}
      loading={loading}
      disabled={disabled}
      block={block}
      onClick={onClick}
      tooltip={!(_title?.trim()) ? t("str.print") : ''}
      icon={<PrinterOutlined />}
    >
      {_title}
    </ButtonComponent>
  );
};