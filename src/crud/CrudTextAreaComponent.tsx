import { RichTextEditor, TextAreaComponent } from "src/common";

import { Form } from "antd";
import { InitialCrudField } from "./CrudComponent";
import { FormInstance } from "antd/lib";
import CrudUtil from "src/util/CrudUtil";
import { Copyable } from ".";

interface InitialTextAreaProps<T> extends InitialCrudField<T> {
  type: "textarea";
  onChange?: (value: string, form: FormInstance<T>) => void;
  /**
   * number of lines to show. If false will not show truncated
   * @default 2
   */
  truncated?: boolean | number;
}

interface TextAreaProps<T> extends InitialTextAreaProps<T> {
  placeholder?: string;
  rows?: number;
  cols?: number;
}

interface RichTextAreaProps<T> extends InitialTextAreaProps<T> {
  rich?: true;
}

export type TextAreaBasedFieldProps<T> = TextAreaProps<T> &
  RichTextAreaProps<T> &
  Copyable<false>;

const CrudTextAreaComponent = <T,>({
  onChange,
  label,
  required,
  rules,
  name,
  updatable = true,
  ...props
}: TextAreaBasedFieldProps<T>) => {
  const form = Form.useFormInstance();
  const realName = CrudUtil.getRealName(name, "upsertFieldName");
  if (props.rich) {
    return (
      <RichTextEditor
        name={realName}
        label={label}
        required={required}
        rules={rules}
        disabled={!updatable}
        help={props.fieldHelper}
      />
    );
  } else {
    const { placeholder, rows, cols, fieldClassName, fieldTooltip } =
      props as TextAreaProps<T>;
    return (
      <TextAreaComponent
        rules={rules}
        placeholder={placeholder}
        onChange={
          onChange ? (val) => onChange(val?.target?.value, form) : undefined
        }
        tooltip={fieldTooltip}
        required={required}
        disabled={!updatable}
        name={name}
        label={label}
        className={fieldClassName}
        rows={rows}
        cols={cols}
        help={props.fieldHelper}
      />
    );
  }
};
export default CrudTextAreaComponent;
