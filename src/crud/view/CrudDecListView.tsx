/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Breakpoint } from "antd";
import { DescList, DescPropsNullable } from "../../common";
import React, { useMemo } from "react";
import { useTranslationLib } from "../../locale";


import { CrudFieldProps, InitialCrudField } from "../CrudComponent";
import { getRendererValueCrudViewer } from "./CrudViewerUtil";
import CrudUtil from "src/util/CrudUtil";

export type DescListColumn =
  | number
  | Partial<Record<Breakpoint, number>>
  | undefined;
export interface CrudDecListViewProps<T> {
  fields: CrudFieldProps<T>[];
  data: T | undefined;
  className?: string;
  descListColumn?: DescListColumn;
  layout?: "horizontal" | "vertical";
  action?: React.JSX.Element;
  keepEmptyValues?: boolean;
}

export function CrudDecListView<T>({
  className,
  fields,
  data,
  descListColumn = { xs: 1, md: 3, sm: 2, lg: 4 },
  layout,
  action,
  keepEmptyValues,
}: Readonly<CrudDecListViewProps<T>>) {
  const { t } = useTranslationLib();

  const _fields: DescPropsNullable[] = useMemo(() => {
    const list: DescPropsNullable[] = fields
      .filter(({ hidden, hideInDescList }) => !hidden && !hideInDescList)
      .map((e, i) => {
        const upsertFieldName = CrudUtil.getRealName(e.name);
        return ({
          label: e.label,
          noFormatting: true,
          value: getRendererValueCrudViewer(e)(
            data?.[upsertFieldName],
            data as any,
            i
          ),
        });
      });
    if (action) list.push({ label: t('str.action'), value: action });
    return list;
  }, [action, data, fields, t]);

  if (!data) return <></>;
  return (
    <DescList
      keepEmptyValues={keepEmptyValues}
      bordered
      column={descListColumn}
      className={className}
      layout={layout}
      list={_fields}
    />
  );
}
