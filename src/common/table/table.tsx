/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import React, { useMemo } from "react";

export type TableComponentColumnProp<T> = {
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  hidden?: boolean;
  title?: any;
  align?: "right" | "left" | "center";
  width?: number | string;
}[] &
  ColumnsType<T>;

export interface TableComponentProps<T> extends TableProps<T> {
  minusHeight?: number;
  count?: number;
  dataSource?: T[];
  columns: TableComponentColumnProp<T>;
  onPageSizeChanged?: (page: number, pageSize: number) => void;
}

function TableComponent<T>({
  minusHeight,
  onRow,
  count = 1,
  onPageSizeChanged,
  pagination = false,
  rowKey = "id",
  columns,
  className,
  scroll,
  ...props
}: TableComponentProps<T>) {
  const cols = useMemo(
    () => columns.filter((val: any) => !val.hidden),
    [columns]
  );
  return (
    <Table
      className={`custom-scroll ${className}`}
      style={{ width: "100%" }}
      columns={cols}
      rowKey={rowKey as any}
      // onRow={onRow as any}
      {...(props as any)}
      scroll={
        scroll
          ? scroll
          : {
              // y: `calc(100vh - ${minusHeight ?? 0}px)`,
              x: true,
              // scrollToFirstRowOnChange: true,
            }
      }
      pagination={pagination}
    />
  );
}

export default TableComponent;
