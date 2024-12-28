/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { EyeOutlined } from "@ant-design/icons";
import { useTranslationLib } from "../../locale";

import ButtonComponent from "./Button";

interface Props<T> {
  value: T;
  onClick: (value: T) => void;
}

function ViewButtonTable<T>({ value, onClick }: Props<T>) {
  const { t } = useTranslationLib();
  return (
    <ButtonComponent
      type="link"
      onClick={() => onClick(value)}
      icon={<EyeOutlined></EyeOutlined>}
      tooltip={t("str.view")}
    />
  );
}

export default ViewButtonTable;
