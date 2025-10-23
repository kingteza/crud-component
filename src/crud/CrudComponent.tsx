import { ColorPickerProps, Form, Modal, Space, Spin } from "antd";

import { Color } from "antd/es/color-picker";
import { Rule } from "antd/es/form";
import { FormInstance } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from "react";

import { CrudForm } from "./CrudForm";
import CrudFormWizard from "./CrudFormWizard";
import { CrudSearchComponentProps } from "./CrudSearchComponent";
import { FileCrudField } from "./FileCrudField";
import { ImageCrudField } from "./ImageCrudField";
import CrudImportButton from "./import/CrudImportButton";
import { CrudImportProps } from "./import/CrudImportComponent";
import CrudViewer, { CrudDragableProps, CrudViewableProps } from "./view/CrudViewer";
import { NewButton, PrintButton } from "../common";
import { SelectTagRenderProps } from "../common/select/SelectComponent";
import IdProps from "../types/Id";
import { useTranslationLib } from "../locale";
import { TextAreaBasedFieldProps } from "./CrudTextAreaComponent";
import { SizeType } from "antd/es/config-provider/SizeContext";
import CrudUtil from "src/util/CrudUtil";

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
> extends Omit<InitialCrudField<T>, "name">, AddonFieldProps {
  name:
    | InitialCrudField<T>["name"]
    | {
        name:  keyof T | (string | number)[];
        upsertFieldName:  keyof T | (string | number)[]; // The field name that will be used in create or update
      };
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
  name: keyof T; // Ensure `name` corresponds to a key in T
  // enum: T[keyof T]
  //   | (T[keyof T] extends string | number | symbol
  //       ? Record<string, T[keyof T]>
  //       : never)
  //   | T[keyof T][]; // Allow plain string arrays
  enum: object | object[];
  radio?: boolean;
  translation?: object;
  multiple?: boolean;
  tagRender?: Record<string, { color: string }> | SelectTagRenderProps;
  // tagRender?: keyof T extends infer K // Infer the name
  //   ? K extends this['name']
  //     ? T[K] extends string | number | symbol // Validate that T[name] is a valid type
  //       ? Record<T[K], { color: string }> // Enforce the structure
  //       : never
  //     : never
  //   : never;// Dynamically infer keys based on `name`
  onChange?: (value: T[keyof T], form: FormInstance<T>) => void;
  onSearch?: (keyword: string, form: FormInstance<T>) => void;
}

export type AddonFieldProps = {
  addonAfter?: ReactNode;
  addonBefore?: ReactNode;
}

export interface ObjectCrudField<T> extends InitialCrudField<T> {
  type: "object";

  render: (value: any, obj: T, index: number) => any;
  translation?: object;
}

export interface TextBasedFieldProps<T> extends InitialCrudField<T>, AddonFieldProps {
  placeholder?: string;
  type: "text" | "time" | "email" | "password";
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

export interface NumberBasedFieldProps<T> extends InitialCrudField<T>, AddonFieldProps {
  type: "number";
  placeholder?: string;
  allowMinus?: boolean;
  min?: number;
  max?: number;
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
    purpose?: CrudPurpose;
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
  viewable?: CrudViewableProps<T>;
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
  draggable?: CrudDragableProps<T>;
  size?: SizeType;
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
  size,
  ...props
}: CrudComponentProps<T, FormType>) {
  const { t } = useTranslationLib();

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
        const upsertFieldName = CrudUtil.getRealName(e.name, 'upsertFieldName');
        const color = form.getFieldValue(upsertFieldName);
        colorValues[upsertFieldName] =
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
          const upsertFieldName = CrudUtil.getRealName(e.name, 'upsertFieldName');
          const dataField = data[upsertFieldName];
          if (isClone && e.type === "image") {
            const filePath = dataField;
            try {
              const clonedFilePath = await e.provider.clone(filePath);
              _data[upsertFieldName] = clonedFilePath;
              continue;
            } catch {
              continue;
            }
          }
          if (e.type === "date") {
            if (dataField) _data[upsertFieldName] = dayjs(dataField);
          } else if (e.type === "select") {
            if (e.multiple && Array.isArray(dataField)) {
              _data[upsertFieldName] = dataField.map(
                (x) => x[e.innerFieldId ?? "id"]
              );
            } else if (dataField && typeof dataField === "object")
              _data[upsertFieldName] = dataField[e.innerFieldId ?? "id"];
            else if (
              (dataField && typeof dataField === "string") ||
              typeof dataField === "number"
            )
              _data[upsertFieldName] = dataField;
          } else _data[upsertFieldName] = dataField;
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
          size={size}
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
        destroyOnHidden
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
