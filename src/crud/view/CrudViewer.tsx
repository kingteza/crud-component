/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Modal } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ExpandableConfig } from "antd/es/table/interface";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { TablePaginationConfig, TableProps } from "antd/lib";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import {
  VerticalSpace,
  CloneButtonTable,
  DeleteButtonTable,
  ExportButton,
  HideButtonTable,
  RefreshButton,
  UpdateButtonTable,
  ViewButtonTable,
  ButtonComponent,
} from "../../common";

import TableComponent, {
  TableComponentColumnProp,
} from "../../common/table/table";
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslationLib } from "../../locale";

import IdProps from "../../types/Id";

import {
  CrudFieldProps,
  CrudPaginateProps,
  InitialCrudField,
} from "../CrudComponent";
import CrudSearchComponent, {
  CrudSearchComponentProps,
} from "../CrudSearchComponent";
import { CrudDecListView, DescListColumn } from "./CrudDecListView";
import { getRendererValueCrudViewer } from "./CrudViewerUtil";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { HolderOutlined } from "@ant-design/icons";
import CrudUtil from "src/util/CrudUtil";

// Create a stable table component that doesn't re-render unnecessarily
const TableComponentMemo = React.memo(TableComponent) as typeof TableComponent;

export type CrudDragableProps<T> = {
  onDragEnd?: (event: DragEndEvent) => void;
  onDrag?: (params: { newOrder: T[] }) => void;
  columnLabel?: string;
  tooltip?: string;
};

export type CrudViewerProps<T, FormType> = {
  fields: CrudFieldProps<T>[];
  decListLayout?: "horizontal" | "vertical";
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
  scroll?: TableProps<T>["scroll"];
  className?: string;
  bordered?: boolean;
  size?: SizeType;
  onClickClone?: (t: T) => Promise<any>;
  onClickRefresh?: () => void;
  expandable?: ExpandableConfig<T>;
  descListColumn?: DescListColumn;
  extraView?: (t: T) => React.ReactElement;
  scrollToTop?: boolean;
  rowClassName?: TableProps<T>["rowClassName"];
  actionWidth?: string | number;
  draggable?: CrudDragableProps<T>;
} & CrudSearchComponentProps<T, FormType>;

function CrudViewer<T, FormType = T>({
  idField = "id",
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
  draggable,
  ...props
}: CrudViewerProps<T, FormType>) {
  const { t } = useTranslationLib();

  const columns = useMemo(
    () =>
      fields.map(
        ({ hideInTable, hidden, width, label, halign, ...props }) => {
          const realName = CrudUtil.getRealName(props.name);
          return ({
            title: label,
            width,
            key: realName,
            dataIndex: realName,
            hidden: hideInTable || hidden,
            align: halign ?? (props.type === "number" ? "right" : undefined),
            render: getRendererValueCrudViewer(props as any),
          });
        }
      ) as TableComponentColumnProp<T>,
    [fields]
  );

  const [openView, setOpenView] = useState<T>();
  const [recentUpdateOrDeleteId, setRecentUpdateOrDeleteId] =
    useState<string>();
  const [dataSource, setDataSource] = useState<T[]>([]);

  useEffect(() => {
    if (data) {
      setDataSource(data);
    }
  }, [data]);

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
            <ExportButton
              value={data}
              onClick={async (data) => await onExport(data)}
            />
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
    ]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (draggable?.onDragEnd) draggable?.onDragEnd(event);
      if (active.id !== over?.id) {
        const activeIndex = dataSource.findIndex(
          (record) => record[idField] === active.id
        );
        const overIndex = dataSource.findIndex(
          (record) => record[idField] === over?.id
        );

        const newDataSource = arrayMove(dataSource, activeIndex, overIndex);

        setDataSource((prevState) => {
          const activeIndex = prevState.findIndex(
            (record) => record[idField] === active?.id
          );
          const overIndex = prevState.findIndex(
            (record) => record[idField] === over?.id
          );
          return arrayMove(prevState, activeIndex, overIndex);
        });

        // Update the backend with the new order
        draggable?.onDrag?.({
          newOrder: newDataSource.map((item) => item[idField]),
        });
      }
    },
    [dataSource, idField, draggable]
  );
  
  const viewTitleValue = useMemo(() => {
    let tempViewTitleValue =
      typeof viewable === "string" ? (openView?.[viewable] as any) : undefined;

    if (typeof tempViewTitleValue === "object") {
      const field = fields.find((e) => {
        const realName = CrudUtil.getRealName(e.name);
        return realName === viewable;
      });
      tempViewTitleValue = getRendererValueCrudViewer(field!)(
        tempViewTitleValue,
        openView!,
        0
      );
    }

    return tempViewTitleValue;
  }, [viewable, openView, fields]);

  // Memoize table props to prevent unnecessary re-renders
  const tableProps = useMemo(
    () => ({
      rowClassName,
      className,
      scroll:
        scroll ??
        (minusHeight ? { y: `calc(100vh - ${minusHeight})` } : undefined),
      id: "crud-table",
      bordered,
      size,
      expandable,
    }),
    [rowClassName, className, scroll, minusHeight, bordered, size, expandable]
  );

  // Memoize pagination props separately
  const paginationProps = useMemo(
    () =>
      paginateProps
        ? ({
            total: paginateProps.count,
            onChange: paginateProps.setPage,
            current: paginateProps.page,
            pageSize: paginateProps.pageSize,
          } as TablePaginationConfig)
        : undefined,
    [paginateProps]
  );

  // Memoize columns separately to avoid recreating on every render
  const tableColumns = useMemo((): TableComponentColumnProp<T> => {
    const hasActions =
      onUpdate || onClickUpdate || onDelete || extraAction || viewable;
    const columns0: TableComponentColumnProp<T> = [];
    if (draggable) {
      columns0.push({
        key: "key",
        align: "center",
        width: 5,
        title: draggable?.columnLabel,
        render: () => <DragHandle tooltip={draggable?.tooltip} />,
      });
    }
    columns0.push(...columns);
    if (!hasActions) return columns0;

    if (hasActions) {
      columns0.push({
        title: t("str.action"),
        fixed: "right" as const,
        width: actionWidth,
        render: (_, data: T) => (
          <>
            {viewable && <ViewButtonTable value={data} onClick={setOpenView} />}
            {actions(data)}
          </>
        ),
      });
    }
    return columns0;
  }, [
    columns,
    onUpdate,
    onClickUpdate,
    onDelete,
    extraAction,
    viewable,
    t,
    actionWidth,
    actions,
  ]);

  // Memoize sortable items for DnD
  const sortableItems = useMemo(
    () => dataSource.map((item) => item[idField]),
    [dataSource, idField]
  );

  // Only wrap with DnD context when needed - this is stable
  const renderTable = useCallback(() => {
    const tableElement = (
      <TableComponentMemo
        {...tableProps}
        dataSource={dataSource}
        loading={loadingData}
        components={draggable ? { body: { row: Row } } : undefined}
        pagination={paginationProps}
        columns={tableColumns}
      />
    );

    // Only wrap with DndContext and SortableContext if draggable is enabled
    if (draggable) {
      return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={sortableItems}
            strategy={verticalListSortingStrategy}
          >
            {tableElement}
          </SortableContext>
        </DndContext>
      );
    }

    return tableElement;
  }, [
    tableProps,
    dataSource,
    loadingData,
    paginationProps,
    tableColumns,
    draggable,
    sortableItems,
    onDragEnd,
  ]);

  return (
    <div>
      {viewable && (
        <Modal
          width={"100%"}
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
                data={openView}
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
        {renderTable()}
      </VerticalSpace>
    </div>
  );
}

export default CrudViewer;

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC<{ tooltip?: string }> = ({ tooltip }) => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <ButtonComponent
      type="text"
      size="small"
      tooltip={tooltip}
      icon={<HolderOutlined />}
      style={{ cursor: "move", border: "none" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};
