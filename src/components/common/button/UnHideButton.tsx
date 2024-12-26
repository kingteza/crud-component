/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { UpCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { ButtonType } from 'antd/es/button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonComponent from './Button';
import { TRANSLATION_NAMESPACE } from 'locale/hooks/translation-constants';

interface Props<T> {
  value: T;
  onClick: (value: T) => Promise<void>;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: ButtonType;
  block?: boolean;
  shouldConfirm?: boolean;
  hidden?: boolean;
}

function UnHideButton<T>({
  shouldConfirm = true,
  block,
  value,
  loading,
  onClick,
  text,
  disabled,
  type = 'link',
  hidden
}: Props<T>) {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const txt = useMemo(() => text ?? t("str.unhide"), [text, t]);
  const [_loading, set_loading] = useState(false);
  useEffect(() => {
    set_loading(loading ?? false);
  }, [loading]);
  const _onClick = useCallback(
    async () => {
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
        icon={<UpCircleOutlined />}
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
      title={t("qus.doYouWantToHide")}
      okText={txt.toUpperCase()}
      cancelText={t("str.no").toUpperCase()}
      onConfirm={_onClick}
    >
      <ButtonComponent
        tooltip={txt}
        icon={<UpCircleOutlined />}
        disabled={disabled}
        loading={_loading}
        type={type}
        danger
        hidden={hidden}
        block={block}
      />
    </Popconfirm>
  );
}

export default UnHideButton;
