import { ColorPickerProps, Form, Modal, Space, Spin } from "antd";

import { Color } from "antd/es/color-picker";
import { Rule } from "antd/es/form";
import { FormInstance } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";
import IdProps from "types/Id";
import { CrudForm } from "./CrudForm";
import CrudFormWizard from "./CrudFormWizard";
import { CrudSearchComponentProps } from "./CrudSearchComponent";
import { FileCrudField } from "./FileCrudField";
import { ImageCrudField } from "./ImageCrudField";
import CrudImportButton from "./import/CrudImportButton";
import { CrudImportProps } from "./import/CrudImportComponent";
import CrudViewer from "./view/CrudViewer";
import { NewButton, PrintButton } from "common";
import { SelectTagRenderProps } from "common/select/SelectComponent";

export type SelectFieldItem = {
  key?: string | number;
  value: string | number;
  disabled?: boolean;
};

const { useForm } = Form;
export interface InitialCrudField<T> {
  label: string;
  updatingValue?: T;
  render?: (value: any, obj: T, index: number) => any;
  required?: boolean;
  updatable?: boolean;
  fieldTooltip?: string;
  hideInTable?: boolean;
  hideInDescList?: boolean;
  readonly?: boolean;
  fieldClassName?: string;
  halign?: "right" | "left";
  /**
   * Indicates the fields is visible or not
   */
  hidden?: boolean;
  width?: number | string; // width for the table column
  name: keyof T | (string | number)[];
  rules?: Rule[];
  grid?: CrudFieldGrid;
  report?: {
    searchable?: boolean;
    sortable?: boolean;
    defaultSort?: boolean | "ASC" | "DESC";
    lock?: boolean; // Whether the field must be visible in the report view
    alreadySelected?: boolean;
    customRender?: (form: FormInstance<any>) => ReactElement;
  };
  customFormFieldRender?: (
    form: FormInstance<T>,
    props: InitialCrudField<T>
  ) => React.ReactElement;
  importProps?: {
    extraFields?: string[];
    hidden?: boolean;
  };
  hideLabel?: boolean;
}

export type CrudFieldGrid = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
};

export interface SelectCrudField<
  T,
  ItemType extends SelectFieldItem = SelectFieldItem
> extends InitialCrudField<T> {
  type: "select";
  placeholder?: string;
  /**
   * @default true
   */
  allowClear?: boolean;
  /**
   * Used when the type is 'select'
   */
  innerFieldId?: string;
  innerFieldLabel?: string;
  /**
   * Used when the type is 'select'
   */
  items: ItemType[];
  tagRender?: SelectTagRenderProps;
  /**
   * Whether the search should be highlighted
   */
  highlightSearch?: boolean;
  /**
   * Used when the type is 'select'
   */
  loading?: boolean;
  /**
   * Used when the type is 'select'
   */
  onSearch?: (
    keyword: any,
    form: FormInstance<T>,
    record: T | undefined
  ) => void;
  /**
   * Used when the type is 'select'. Wether the result should refresh if the search value is changed.
   */
  searchOnType?: boolean;
  multiple?: boolean;
  report?: InitialCrudField<T>["report"] & {
    multiple?: boolean;
  };
  onChange?: (value: any, form: FormInstance<T>) => void;
  onSet?: (
    value: any | any[],
    items: SelectFieldItem[],
    form: FormInstance<T>
  ) => void;
}

export interface EnumCrudField<T> extends InitialCrudField<T> {
  type: "enum";
  placeholder?: string;
  enum: object | object[];
  radio?: boolean;
  translation?: object;
  multiple?: boolean;
  tagRender?: SelectTagRenderProps;
  onChange?: (value: any, form: FormInstance<T>) => void;
  onSearch?: (keyword: any, form: FormInstance<T>) => void;
}

export interface ObjectCrudField<T> extends InitialCrudField<T> {
  type: "object";

  render: (value: any, obj: T, index: number) => any;
  translation?: object;
}

export interface TextBasedFieldProps<T> extends InitialCrudField<T> {
  placeholder?: string;
  type: "text" | "time" | "email" | "password";
  onChange?: (value: string, form: FormInstance<T>) => void;
}

export interface TextAreaBasedFieldProps<T> extends InitialCrudField<T> {
  placeholder?: string;
  type: "textarea";
  rows?: number;
  cols?: number;
  /**
   * number of lines to show. If false will not show truncated
   * @default 2
   */
  truncated?: boolean | number;
  onChange?: (value: string, form: FormInstance<T>) => void;
}

export interface ColorPickerFieldProps<T>
  extends Omit<InitialCrudField<T>, "placeholder"> {
  type: "color";
  innerProps?: ColorPickerProps;
}

export interface CheckboxBasedFieldProps<T> extends InitialCrudField<T> {
  type: "checkbox";
  onChange?: (value: boolean, form: FormInstance<T>) => void;
}

export interface NumberBasedFieldProps<T> extends InitialCrudField<T> {
  type: "number";
  placeholder?: string;
  allowMinus?: boolean;
  /**
   * If it is number field making this true will convert the value to comma separated number field
   */
  formatted?: boolean;
  int?: boolean;
  onChange?: (value: number, form: FormInstance<T>) => void;
}

export interface DateBasedFieldProps<T> extends InitialCrudField<T> {
  type: "date";
  format?: string;
  placeholder?: string;
  /**
   * If it is number field making this true will convert the value to comma separated number field
   */
  formatTime?: boolean;
  range?: boolean;
  disableToday?: boolean;
  disabledFutureDays?: boolean;
  disabledPastDays?: boolean;
  report?: InitialCrudField<T>["report"] & {
    range?: boolean;
    required?: boolean;
  };
  onChange?: (value: Dayjs | undefined, form: FormInstance<T>) => void;
}

export interface TimeBasedFieldProps<T> extends InitialCrudField<T> {
  type: "time";
  placeholder?: string;
  use12Hours?: boolean;
  range?: boolean;
  format?: "h:mm:ss" | "h:mm:ss A" | "h:mm" | "h:mm A" | "mm" | "h" | "h A";
  disableCurrent?: boolean;
  disabledFuture?: boolean;
  disabledPast?: boolean;
  report?: InitialCrudField<T>["report"] & {
    range?: boolean;
  };
  onChange?: (value: Dayjs | undefined, form: FormInstance<T>) => void;
}

export type CrudPurpose = "new" | "clone" | "update";

export type GetFormFieldOptions = {
  onChange?: (value: any) => void;
  render?: (component: React.JSX.Element) => React.ReactElement;
};
export type FormBuilderFunc0<T> = (
  name: keyof T,
  options?: GetFormFieldOptions
) => ReactElement;
export type FormBuilderFunc<T> = (
  i: FormBuilderFunc0<T>,
  otherUtils: {
    isAnyFieldHidden: (...name: Array<keyof T>) => boolean;
    isAllFieldsHidden: (...name: Array<keyof T>) => boolean;
  }
) => ReactElement;

export type CrudFieldProps<T> =
  | SelectCrudField<T>
  | TextBasedFieldProps<T>
  | TextAreaBasedFieldProps<T>
  | ImageCrudField<T>
  | EnumCrudField<T>
  | DateBasedFieldProps<T>
  | TimeBasedFieldProps<T>
  | ObjectCrudField<T>
  | NumberBasedFieldProps<T>
  | CheckboxBasedFieldProps<T>
  | ColorPickerFieldProps<T>
  | FileCrudField<T>;

export type CrudPaginateProps =
  | false
  | {
      page?: number;
      setPage?: (page: number, pageSize?: number) => void;
      pageSize?: number;
      count?: number;
    };

export type CrudWizardProp<T> = {
  title: string;
  fields: Array<keyof T>;
  icon?: ReactElement;
  formBuilder?: FormBuilderFunc<T>;
  grid?: boolean;
};

export type CrudComponentProps<T, FormType = T> = {
  fields: CrudFieldProps<T>[];
  data: T[] | undefined;
  idField?: string;
  grid?: boolean;
  onPrint?: () => void;
  printing?: boolean;
  onCreate?: (t: FormType) => Promise<any>;
  onHide?: (id: any) => Promise<any>;
  onDelete?: (id: any) => Promise<any>;
  onUpdate?: (t: FormType & IdProps) => Promise<any>;
  loadingData?: boolean;
  isCreating?: boolean;
  isHiding?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  viewable?: boolean | keyof T;
  extraAction?: (t: T) => ReactElement;
  paginateProps?: CrudPaginateProps;
  formBuilder?: FormBuilderFunc<T>;
  minusHeight?: string;
  cloneable?: boolean;
  fullWidthModal?: boolean;
  wizard?: CrudWizardProp<T>[];
  extraView?: (t: T) => React.ReactElement;
  importable?: CrudImportProps<T>;
  onClickNew?: () => void;
} & CrudSearchComponentProps<T, FormType>;

function CrudComponent<T, FormType = T>({
  idField = "id",
  onCreate,
  onDelete,
  onHide,
  onUpdate,
  fields,
  data,
  grid,
  isHiding,
  isCreating,
  isDeleting,
  isUpdating,
  paginateProps,
  onPrint,
  printing,
  viewable,
  loadingData,
  formBuilder,
  extraAction,
  minusHeight,
  cloneable,
  fullWidthModal = true,
  wizard,
  extraView,
  importable,
  onClickNew,
  ...props
}: CrudComponentProps<T, FormType>) {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  const [openModal, setOpenModal] = useState(false);

  const [updatingField, setUpdatingField] = useState<T>();
  const [updatingValueWizard, setUpdatingValueForWizard] = useState<any>();
  const [form] = useForm();
  const _onSave = useCallback(
    async (x?: any) => {
      const field = wizard ? x : await form.validateFields();
      const colorFields = fields.filter((e) => e.type === "color");
      const colorValues = {};
      colorFields.forEach((e) => {
        const color = form.getFieldValue(e.name);
        colorValues[e.name as any] =
          typeof color === "string"
            ? color
            : (color as Color)?.toHexString()?.toUpperCase();
      });
      Object.assign(field, colorValues);
      if (updatingField && onUpdate) {
        await onUpdate({
          ...field,
          [idField]: updatingField[idField],
        });
        setUpdatingField(undefined);
      } else if (!updatingField && onCreate) {
        await onCreate(field);
      }
      setUpdatingValueForWizard(undefined);
      form.resetFields();
      setOpenModal(false);
    },
    [fields, form, idField, onCreate, onUpdate, updatingField, wizard]
  );

  const [blockSubmitButton, setBlockSubmitButton] = useState(false);
  const [blockCancelButton, setBlockCancelButton] = useState(false);

  useEffect(() => {
    if (openModal) {
      setBlockSubmitButton(false);
      setBlockCancelButton(false);
    } else {
      setPurpose(undefined);
    }
  }, [openModal]);

  const onUploading = useCallback(async (p) => {
    setBlockSubmitButton(p);
    setBlockCancelButton(true);
  }, []);

  const _onDeleteFile = useCallback(async () => {
    setBlockCancelButton(true);
  }, []);

  const [updating, setUpdating] = useState(false);

  const onClickUpdate = useCallback(
    async (data: T, shouldSetUpdatingField = true, isClone = false) => {
      try {
        setUpdating(true);
        setOpenModal(true);
        if (shouldSetUpdatingField) setPurpose("update");
        const _data = {};
        for (const e of fields) {
          const dataField = data[e.name as any];
          if (isClone && e.type === "image") {
            const filePath = dataField;
            try {
              const clonedFilePath = await e.provider.clone(filePath);
              _data[e.name as any] = clonedFilePath;
              continue;
            } catch {
              continue;
            }
          }
          if (e.type === "date") {
            if (dataField) _data[e.name as any] = dayjs(dataField);
          } else if (e.type === "select") {
            if (e.multiple && Array.isArray(dataField)) {
              _data[e.name as any] = dataField.map(
                (x) => x[e.innerFieldId ?? "id"]
              );
            } else if (dataField && typeof dataField === "object")
              _data[e.name as any] = dataField[e.innerFieldId ?? "id"];
            else if (
              (dataField && typeof dataField === "string") ||
              typeof dataField === "number"
            )
              _data[e.name as any] = dataField;
          } else _data[e.name as any] = dataField;
        }
        form.setFieldsValue(_data);
        setUpdatingValueForWizard(_data);
        if (shouldSetUpdatingField) setUpdatingField(data);
      } finally {
        setUpdating(false);
      }
    },
    [fields, form]
  );

  const [purpose, setPurpose] = useState<CrudPurpose>();
  const onClickClone = useCallback(
    async (data: T) => {
      setPurpose("clone");
      onClickUpdate(data, false, true);
    },
    [onClickUpdate]
  );

  return (
    <>
      <Space direction="vertical" className="w-100">
        <div className="w-100 d-flex">
          <div style={{ flex: 1 }}>
            <NewButton
              onClick={() => {
                if (onClickNew) {
                  onClickNew();
                } else {
                  setOpenModal((e) => !e);
                  setPurpose("new");
                }
              }}
              className="flex-1"
            ></NewButton>
          </div>
          <Space>
            {Boolean(onPrint) && (
              <PrintButton
                className="float-right"
                loading={printing}
                onClick={onPrint}
              ></PrintButton>
            )}
            {Boolean(importable) && (
              <CrudImportButton fields={fields} importProps={importable!} />
            )}
          </Space>
        </div>
        <CrudViewer<T, FormType>
          {...props}
          minusHeight={minusHeight}
          data={data}
          fields={fields}
          extraAction={extraAction}
          idField={idField}
          isDeleting={isDeleting}
          loadingData={loadingData}
          onClickUpdate={onUpdate ? onClickUpdate : undefined}
          onHide={onHide}
          isHiding={isHiding}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onClickClone={cloneable ? onClickClone : undefined}
          paginateProps={paginateProps}
          viewable={viewable}
          extraView={extraView}
        />
      </Space>
      <Modal
        width={fullWidthModal ? "100%" : undefined}
        title={t(purpose ?? "new")}
        open={openModal}
        confirmLoading={isCreating || isUpdating}
        okText={t("str." + (purpose === "update" ? "update" : "save"))}
        cancelText={t("str.cancel")}
        cancelButtonProps={{
          disabled: blockCancelButton,
          hidden: Boolean(wizard),
        }}
        okButtonProps={{
          disabled: blockSubmitButton,
          hidden: Boolean(wizard),
        }}
        onCancel={async () => {
          try {
            if (purpose === "clone") {
              const values = !wizard ? form.getFieldsValue() : updatingField;
              const imageFields = fields.filter((e) => e.type === "image");
              for (const field of imageFields) {
                if (values[field.name]) {
                  (field as ImageCrudField<T>).provider.delete(
                    values[field.name]
                  );
                }
              }
            }
          } finally {
            //
          }
          if (!wizard) form.resetFields();
          setUpdatingValueForWizard(undefined);
          setUpdatingField(undefined);
          setOpenModal(false);
        }}
        onOk={() => _onSave()}
        destroyOnClose
      >
        <Spin spinning={updating}>
          {!wizard && (
            <CrudForm
              purpose={purpose}
              fields={fields}
              form={form}
              formBuilder={formBuilder}
              grid={grid}
              onDeleteFile={_onDeleteFile}
              onUploadFile={onUploading}
            />
          )}
          {wizard && (
            <CrudFormWizard<T>
              submitting={isCreating || isUpdating}
              className={"mt-2"}
              onSave={_onSave}
              updatingValue={updatingValueWizard}
              fields={fields}
              onDeleteFile={_onDeleteFile}
              onUploadFile={onUploading}
              purpose={purpose}
              wizard={wizard}
            />
          )}
        </Spin>
      </Modal>
    </>
  );
}

export default CrudComponent;
