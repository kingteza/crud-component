/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Tag } from 'antd';
import { TRANSLATION_NAMESPACE } from 'locale/hooks/translation-constants';
import { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type StatusTagProps = {
  translation: any;
  value: string;
  clickable?: boolean;
  onClick?: () => void;
  colorFunction?: (
    val
  ) => { color?: string; text?: string; icon?: ReactElement };
};
const StatusTag: FC<StatusTagProps> = ({
  onClick,
  clickable,
  colorFunction,
  translation,
  value,
}) => {
  const val = colorFunction?.(value);
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const Component = Tag;
  return (
    <Component
      onClick={onClick}
      color={(val as any)?.color}
      icon={val?.icon}
      style={{
        color: (val as any)?.text,
        cursor: clickable ? 'pointer' : undefined,
      }}
    >
      {t(translation[value])?.toUpperCase()}
    </Component>
  );
};

export default StatusTag;
