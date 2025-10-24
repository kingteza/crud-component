/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Breakpoint } from "antd";
import { DescList, DescPropsNullable } from "../../common";
import { useMemo } from "react";
import { useTranslationLib } from "../../locale";

import { CrudFieldProps } from "../CrudComponent";
import { getRendererValueCrudViewer } from "./CrudViewerUtil";
import CrudUtil from "src/util/CrudUtil";
import CrudActions, { CrudActionsProps } from "../actions";
import { CrudModalProps } from "../modal";

export type DescListColumn =
  | number
  | Partial<Record<Breakpoint, number>>
  | undefined;
export interface CrudDecListViewProps<T, FormType = T>
  extends Omit<CrudActionsProps<T, FormType>, "inBuiltModalProps"> {
  fields: CrudFieldProps<T>[];
  data: T | undefined;
  className?: string;
  descListColumn?: DescListColumn;
  layout?: "horizontal" | "vertical";
  keepEmptyValues?: boolean;
  inBuiltModalProps?: Omit<CrudModalProps<T, FormType>, "fields">;
}

export function CrudDecListView<T, FormType = T>({
  className,
  fields,
  data,
  descListColumn = { xs: 1, md: 3, sm: 2, lg: 4 },
  layout,
  keepEmptyValues,
  inBuiltModalProps,
  ...crudActionsProps
}: Readonly<CrudDecListViewProps<T, FormType>>) {
  const { t } = useTranslationLib();

  const _fields: DescPropsNullable[] = useMemo(() => {
    const list: DescPropsNullable[] = fields
      .filter(({ hidden, hideInDescList }) => !hidden && !hideInDescList)
      .map((e, i) => {
        const upsertFieldName = CrudUtil.getRealName(e.name);
        return {
          label: e.label,
          noFormatting: true,
          value: getRendererValueCrudViewer(e)(
            data?.[upsertFieldName],
            data as any,
            i
          ),
        };
      });

    // Add actions if data exists and any action props are provided
    const actionComponent = data ? (
      <CrudActions<T, FormType>
        data={data}
        {...crudActionsProps}
        inBuiltModalProps={
          inBuiltModalProps ? { ...inBuiltModalProps, fields } : undefined
        }
      />
    ) : undefined;
    
    if (actionComponent) {
      list.push({
        label: t("str.action"),
        value: actionComponent,
      });
    }
    return list;
  }, [data, fields, t, crudActionsProps]);

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
