/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { CopyOutlined } from '@ant-design/icons';

import ButtonComponent from './Button';
import { useTranslationLib } from '../../locale';

interface Props<T> {
  value: T;
  onClick: (value: T) => void;
}

function CloneButtonTable<T>({ value, onClick }: Props<T>) {
  const { t } = useTranslationLib();
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
