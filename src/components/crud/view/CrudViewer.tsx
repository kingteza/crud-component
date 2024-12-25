/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Modal, Tooltip } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ExpandableConfig } from 'antd/es/table/interface';
import { TableProps } from 'antd/lib';
import CloneButtonTable from 'components/common/button/CloneButtonTable';
import DeleteButtonTable from 'components/common/button/DeleteButtonTable';
import { ExportButton } from 'components/common/button/ExportButton';
import HideButtonTable from 'components/common/button/HideButtonTable';
import { RefreshButton } from 'components/common/button/RefreshButton';
import UpdateButtonTable from 'components/common/button/UpdateButtonTable';
import ViewButtonTable from 'components/common/button/ViewButtonTable';
import VerticalSpace from 'components/common/layout/VerticalSpace';
import ShowMore from 'components/common/show-more';
import TableComponent, { TableComponentColumnProp } from 'components/common/table/table';
import { translations } from 'config/localization/translations';
import { t } from 'i18next';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IdProps from 'types/Id';
import DateUtil from 'util/DateUtil';
import NumberUtil from 'util/NumberUtil';

import {
  CrudFieldProps,
  CrudPaginateProps,
  DateBasedFieldProps,
  EnumCrudField,
  NumberBasedFieldProps,
  SelectCrudField,
  TextAreaBasedFieldProps,
  TimeBasedFieldProps,
} from '../CrudComponent';
import CrudSearchComponent, { CrudSearchComponentProps } from '../CrudSearchComponent';
import { FileCrudCellValue } from '../FileCrudField';
import { ImageCrudCellValue, ImageCrudField } from '../ImageCrudField';
import { CrudDecListView, DescListColumn } from './CrudDecListView';

export type CrudViewerProps<T, FormType> = {
  fields: CrudFieldProps<T>[];
  decListLayout?: 'horizontal' | 'vertical';
  viewable?: boolean | keyof T;
  paginateProps?: CrudPaginateProps;
  onDelete?: (id: any) => Promise<any>;
  confirmDeleting?: boolean;
  confirmHiding?: boolean;
  onHide?: (id: any) => Promise<any>;
  onUpdate?: (t: FormType & IdProps) => Promise<any>;
  onExport?: (t: T) => Promise<any>;
  data: T[] | undefined;
  extraAction?: (t: T) => ReactElement | undefined | ReactElement[];
  onClickUpdate?: (t: T) => void;
  closeViewOnClickUpdate?: boolean;
  isHiding?: boolean;
  isDeleting?: boolean;
  idField?: string;
  loadingData?: boolean;
  minusHeight?: string;
  scroll?: TableProps<T>['scroll'];
  className?: string;
  bordered?: boolean;
  size?: SizeType;
  onClickClone?: (t: T) => Promise<any>;
  onClickRefresh?: () => void;
  expandable?: ExpandableConfig<T>;
  descListColumn?: DescListColumn;
  extraView?: (t: T) => React.ReactElement;
  scrollToTop?: boolean;
  rowClassName?: TableProps<T>['rowClassName'];
  actionWidth?: string | number;
} & CrudSearchComponentProps<T, FormType>;

function CrudViewer<T, FormType = T>({
  idField = 'id',
  loadingData,
  fields,
  isDeleting,
  isHiding,
  viewable = false,
  paginateProps,
  onDelete,
  onHide,
  onUpdate,
  data = [],
  extraAction,
  onClickUpdate,
  minusHeight,
  scroll,
  onClickClone,
  className,
  expandable,
  size,
  bordered,
  descListColumn,
  extraView,
  decListLayout,
  scrollToTop,
  onClickRefresh,
  closeViewOnClickUpdate,
  onExport,
  confirmHiding,
  confirmDeleting,
  rowClassName,
  actionWidth = 190,
  ...props
}: CrudViewerProps<T, FormType>) {
  const { t } = useTranslation();

  const columns = useMemo(
    () =>
      fields.map(({ hideInTable, hidden, width, name, label, halign, ...props }) => ({
        title: label,
        width,
        key: name,
        dataIndex: name,
        hidden: hideInTable || hidden,
        align: halign ?? (props.type === 'number' ? 'right' : undefined),
        render: getRendererValueCrudViewer(props as any),
      })) as TableComponentColumnProp<T>,
    [fields],
  );

  const [openView, setOpenView] = useState<T>();
  const [recentUpdateOrDeleteId, setRecentUpdateOrDeleteId] = useState<string>();

  useEffect(() => {
    if (data) {
      setOpenView((openView) => {
        if (!openView) return undefined;
        return data.find((e) => e[idField] === openView[idField]);
      });
    }
  }, [data, idField, openView]);
  const actions = useCallback(
    (data: T) => {
      const extra = extraAction?.(data);
      return (Array.isArray(extra) ? extra?.filter(Boolean)?.length : extra) ||
        onUpdate ||
        onClickUpdate ||
        onClickClone ||
        onDelete ? (
        <>
          {extra}
          {(onUpdate || onClickUpdate) && (
            <UpdateButtonTable
              value={data}
              onClick={(e) => {
                setRecentUpdateOrDeleteId(e[idField]);
                onClickUpdate?.(data);
                if (closeViewOnClickUpdate) setOpenView(undefined);
              }}
            />
          )}
          {onClickClone && (
            <CloneButtonTable value={data} onClick={(e) => onClickClone(e)} />
          )}
          {onExport && (
            <ExportButton value={data} onClick={async (data) => await onExport(data)} />
          )}
          {onHide && (
            <HideButtonTable
              value={data}
              disabled={isHiding}
              shouldConfirm={confirmHiding}
              loading={isHiding && data[idField] === recentUpdateOrDeleteId}
              onClick={async (e) => {
                setRecentUpdateOrDeleteId(e[idField]);
                await onHide({ [idField]: e[idField] });
              }}
            />
          )}
          {onDelete && (
            <DeleteButtonTable
              value={data}
              disabled={isDeleting}
              shouldConfirm={confirmDeleting}
              loading={isDeleting && data[idField] === recentUpdateOrDeleteId}
              onClick={async (e) => {
                setRecentUpdateOrDeleteId(e[idField]);
                await onDelete({ [idField]: e[idField] });
              }}
            ></DeleteButtonTable>
          )}
        </>
      ) : undefined;
    },
    [
      closeViewOnClickUpdate,
      confirmDeleting,
      confirmHiding,
      extraAction,
      idField,
      isDeleting,
      isHiding,
      onClickClone,
      onClickUpdate,
      onDelete,
      onExport,
      onHide,
      onUpdate,
      recentUpdateOrDeleteId,
    ],
  );

  const viewTitleValue = useMemo(() => {
    let tempViewTitleValue =
      typeof viewable === 'string' ? (openView?.[viewable] as any) : undefined;

    if (typeof tempViewTitleValue === 'object') {
      const field = fields.find((e) => e.name === viewable);
      tempViewTitleValue = getRendererValueCrudViewer(field!)(
        tempViewTitleValue,
        openView!,
        0,
      );
    }

    return tempViewTitleValue;
  }, [viewable, openView, fields]);

  return (
    <div>
      {viewable && (
        <Modal
          width={'100%'}
          open={Boolean(openView)}
          title={viewTitleValue ?? <div>&nbsp;</div>}
          footer={<></>}
          closable
          onCancel={() => setOpenView(undefined)}
        >
          {Boolean(openView) && (
            <div key={openView?.[idField]}>
              <CrudDecListView
                layout={decListLayout}
                descListColumn={descListColumn}
                data={openView!}
                fields={fields}
                action={actions(openView!)}
              />
              {extraView?.(openView!)}
            </div>
          )}
        </Modal>
      )}
      <CrudSearchComponent<T, FormType> fields={fields} {...props} />
      <VerticalSpace>
        {Boolean(onClickRefresh) && <RefreshButton onClick={onClickRefresh} />}
        <TableComponent
          rowClassName={rowClassName}
          className={className}
          scroll={
            scroll ??
            (minusHeight
              ? {
                  y: `calc(100vh - ${minusHeight})`,
                }
              : undefined)
          }
          id="crud-table"
          dataSource={data}
          loading={loadingData}
          bordered={bordered}
          size={size}
          expandable={expandable}
          pagination={
            paginateProps
              ? {
                  total: paginateProps.count,
                  onChange: paginateProps.setPage,
                  current: paginateProps.page,
                  pageSize: paginateProps.pageSize,
                }
              : undefined
          }
          columns={
            (onUpdate || onClickUpdate || onDelete || extraAction || viewable
              ? [
                  ...columns,
                  {
                    title: t(translations.str.action),
                    dataIndex: '',
                    fixed: 'right',
                    width: actionWidth,
                    render: (_, data: T) => (
                      <>
                        {viewable && (
                          <ViewButtonTable value={data} onClick={setOpenView} />
                        )}
                        {actions(data)}
                      </>
                    ),
                  },
                ]
              : columns) as TableComponentColumnProp<T>
          }
        ></TableComponent>
      </VerticalSpace>
    </div>
  );
}

export default CrudViewer;
