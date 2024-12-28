/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { EditOutlined } from '@ant-design/icons';
import { useTranslationLib } from '../../locale';

import ButtonComponent from './Button';

interface Props<T> {
  value: T;
  onClick: (value: T) => void;
}

function UpdateButtonTable<T>({ value, onClick }: Props<T>) {
  const { t } = useTranslationLib();
  return (
    <ButtonComponent
      tooltip={t("str.update")}
      type="link"
      onClick={() => onClick(value)}
      icon={<EditOutlined />}
    />
  );
}

export default UpdateButtonTable;
