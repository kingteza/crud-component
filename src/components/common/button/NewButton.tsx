/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { PlusOutlined } from "@ant-design/icons";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ButtonType } from "antd/lib/button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import ButtonComponent from "./Button";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";

export const NewButton: FC<{
  to?: string;
  onClick?: (value: boolean) => void;
  title?: string;
  type?: ButtonType;
  block?: boolean;
  className?: string;
  size?: SizeType;
}> = ({ size, block, className, type = "primary", onClick, title, to }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  return (
    <ButtonComponent
      type={type}
      className={className}
      to={to}
      block={block}
      size={size}
      onClick={onClick && (() => onClick(true))}
      icon={<PlusOutlined />}
    >
      {title ?? t("str.new")}
    </ButtonComponent>
  );
};
