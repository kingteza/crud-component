/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { ReloadOutlined } from "@ant-design/icons";
import { ButtonType } from "antd/lib/button";
import { FC } from "react";
import { useTranslationLib } from "../../locale";


import ButtonComponent from "./Button";

export const RefreshButton: FC<{
  to?: string;
  onClick?: (value: boolean) => void;
  title?: string;
  type?: ButtonType;
  block?: boolean;
  className?: string;
  disabled?: boolean;
}> = ({ disabled, block, className, type = "primary", onClick, title, to }) => {
  const { t } = useTranslationLib();

  return (
    <ButtonComponent
      type={type}
      disabled={disabled}
      className={className}
      to={to}
      block={block}
      onClick={onClick && (() => onClick(true))}
      icon={<ReloadOutlined />}
    >
      {title ?? t("str.refresh")}
    </ButtonComponent>
  );
};
