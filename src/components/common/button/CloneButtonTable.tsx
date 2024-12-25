/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { CopyOutlined } from '@ant-design/icons';
import React from 'react';
 
import ButtonComponent from './Button';
import { useLibTranslation } from 'i18n/hooks/useLibTranslation';

interface Props<T> {
  value: T;
  onClick: (value: T) => void;
}

function CloneButtonTable<T>({ value, onClick }: Props<T>) {
  const { t } = useLibTranslation();
  return (
    <ButtonComponent
      type="link"
      onClick={() => onClick(value)}
      icon={<CopyOutlined />}
      tooltip={t('clone')}
    />
  );
}

export default CloneButtonTable;
