/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { PlusOutlined } from "@ant-design/icons";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ButtonType } from "antd/lib/button";
import { FC, MouseEvent } from "react";
import { useTranslationLib } from "../../locale";

import ButtonComponent from "./Button";
import { ButtonProps } from "antd";

export const NewButton: FC<
  {
    to?: string;
    onClick?: (
      value: boolean,
      event: MouseEvent<HTMLElement>
    ) => void;
    title?: string;
    type?: ButtonType;
    block?: boolean;
    className?: string;
    size?: SizeType;
  } & Omit<ButtonProps, "onClick">
> = ({
  size,
  block,
  className,
  type = "primary",
  onClick,
  title,
  to,
  ...props
}) => {
  const { t } = useTranslationLib();

  return (
    <ButtonComponent
      type={type}
      className={className}
      to={to}
      block={block}
      size={size}
      onClick={onClick && ((e) => onClick(true, e))}
      icon={<PlusOutlined />}
      {...props}
    >
      {title ?? t("str.new")}
    </ButtonComponent>
  );
};
