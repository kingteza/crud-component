import { Form, Modal, Spin } from "antd";
import { Color } from "antd/es/color-picker";
import { FormInstance } from "antd/lib";
import {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  Ref,
} from "react";

import { CrudForm } from "../CrudForm";
import CrudFormWizard from "../CrudFormWizard";
import {
  CrudFieldProps,
  CrudWizardProp,
  FormBuilderFunc,
} from "../CrudComponent";
import { ImageCrudField } from "../ImageCrudField";
import { useTranslationLib } from "../../locale";
import CrudUtil from "../../util/CrudUtil";
import IdProps from "../../types/Id";
import dayjs from "dayjs";

export interface CrudModalProps<T, FormType> {
  fields: CrudFieldProps<T>[];
  wizard?: CrudWizardProp<T>[];
  grid?: boolean;
  fullWidthModal?: boolean;
  isCreating?: boolean;
  isUpdating?: boolean;
  onCreate?: (data: FormType) => Promise<any>;
  onUpdate?: (data: FormType & IdProps) => Promise<any>;
  idField?: string;
  formBuilder?: FormBuilderFunc<T>;
}

export interface CrudModalRef<T> {
  create: () => void;
  update: (
    data: T,
    shouldSetUpdatingField?: boolean,
    isClone?: boolean
  ) => Promise<void>;
}

const CrudModal = <T, FormType = T>(
  {
    fields,
    wizard,
    grid,
    fullWidthModal,
    isCreating,
    isUpdating,
    onCreate,
    onUpdate,
    idField = "id",
    formBuilder,
  }: CrudModalProps<T, FormType>,
  ref: Ref<CrudModalRef<T>>
) => {
  const [form] = Form.useForm();
  const { t } = useTranslationLib();
  
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState<"new" | "update" | "clone">("new");

  const [updatingField, setUpdatingField] = useState<T>();
  const [updatingValueForWizard, setUpdatingValueForWizard] = useState<any>();
  const [blockSubmitButton, setBlockSubmitButton] = useState(false);
  const [blockCancelButton, setBlockCancelButton] = useState(false);
  const [updating, setUpdating] = useState(false);

  const _onSave = useCallback(
    async (x?: any) => {
      const field = wizard ? x : await form.validateFields();
      const colorFields = fields.filter((e) => e.type === "color");
      const colorValues = {};
      for (const e of colorFields) {
        const upsertFieldName = CrudUtil.getRealName(e.name, "upsertFieldName");
        const color = form.getFieldValue(upsertFieldName);
        colorValues[upsertFieldName] =
          typeof color === "string"
            ? color
            : (color as Color)?.toHexString()?.toUpperCase();
      }
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
      setOpen(false);
    },
    [fields, form, idField, onCreate, onUpdate, updatingField, wizard]
  );

  const onUploading = useCallback(async (p) => {
    setBlockSubmitButton(p);
    setBlockCancelButton(true);
  }, []);

  const _onDeleteFile = useCallback(async () => {
    setBlockCancelButton(true);
  }, []);

  const create = useCallback(() => {
    setOpen(true);
    setPurpose("new");
    form.resetFields();
    setUpdatingField(undefined);
    setUpdatingValueForWizard(undefined);
  }, [form]);

  const update = useCallback(
    async (data: T, shouldSetUpdatingField = true, isClone = false) => {
      try {
        setUpdating(true);
        setOpen(true);
        setPurpose(isClone ? "clone" : "update");
        
        const _data = {};
        for (const e of fields) {
          const upsertFieldName = CrudUtil.getRealName(
            e.name,
            "upsertFieldName"
          );
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

  useImperativeHandle(
    ref,
    () => ({
      create,
      update,
    }),
    [create, update]
  );

  useEffect(() => {
    if (open) {
      setBlockSubmitButton(false);
      setBlockCancelButton(false);
    }
  }, [open]);

  const handleCancel = useCallback(async () => {
    try {
      if (purpose === "clone") {
        const values = !wizard ? form.getFieldsValue() : updatingField;
        const imageFields = fields.filter((e) => e.type === "image");
        for (const field of imageFields) {
          if (values[field.name]) {
            (field as ImageCrudField<T>).provider.delete(values[field.name]);
          }
        }
      }
    } finally {
      //
    }
    if (wizard) {
      // Wizard handles its own form reset
    } else {
      form.resetFields();
    }
    setUpdatingValueForWizard(undefined);
    setUpdatingField(undefined);
    setOpen(false);
  }, [purpose, wizard, form, updatingField, fields]);

  return (
    <Modal
      width={fullWidthModal ? "100%" : undefined}
      title={t(purpose ?? "new")}
      open={open}
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
      onCancel={handleCancel}
      onOk={() => _onSave()}
      destroyOnHidden
    >
      <Spin spinning={updating}>
        {wizard ? null : (
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
            updatingValue={updatingValueForWizard}
            fields={fields}
            onDeleteFile={_onDeleteFile}
            onUploadFile={onUploading}
            purpose={purpose}
            wizard={wizard}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default forwardRef(CrudModal) as <T, FormType = T>(
  props: CrudModalProps<T, FormType> & { ref?: Ref<CrudModalRef<T>> }
) => ReturnType<typeof CrudModal>;
