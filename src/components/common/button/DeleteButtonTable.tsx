/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { ButtonType } from 'antd/es/button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../config/localization/translations';
import ButtonComponent from './Button';

interface Props<T> {
  value: T;
  onClick: (value: T) => Promise<void>;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: ButtonType;
  block?: boolean;
  shouldConfirm?: boolean;
}

function DeleteButtonTable<T>({
  shouldConfirm = true,
  block,
  value,
  loading,
  onClick,
  text,
  disabled,
  type = 'link',
}: Props<T>) {
  const { t } = useTranslation();
  const txt = useMemo(() => text ?? t(translations.str.delete), [text, t]);
  const [_loading, set_loading] = useState(false);
  useEffect(() => {
    set_loading(loading ?? false);
  }, [loading]);
  const _onClick = useCallback(
    async (e) => {
      try {
        set_loading(true);
        await onClick(value);
      } finally {
        set_loading(false);
      }
    },
    [onClick, value],
  );

  if (!shouldConfirm) {
    return (
      <ButtonComponent
        tooltip={txt}
        icon={<DeleteOutlined />}
        disabled={disabled}
        loading={_loading}
        type={type}
        danger
        block={block}
        onClick={_onClick}
      />
    );
  }
  return (
    <Popconfirm
      title={t(translations.qus.doYouWantToDelete)}
      okText={txt.toUpperCase()}
      cancelText={t(translations.str.no).toUpperCase()}
      onConfirm={_onClick}
    >
      <ButtonComponent
        tooltip={txt}
        icon={<DeleteOutlined />}
        disabled={disabled}
        loading={_loading}
        type={type}
        danger
        block={block}
      />
    </Popconfirm>
  );
}

export default DeleteButtonTable;
